import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppleCard } from "./AppleCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Mail,
  Calendar,
  Building2,
  Download,
  Eye,
  MapPin,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { SendLAFormModal } from "./SendLAFormModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { pdf } from "@react-pdf/renderer";
import { LAResponsePDF } from "./LAResponsePDF";

interface ResponseData {
  responseType: 'not_known' | 'known_no_info' | 'known_with_info' | 'unable_to_provide';
  relevantInformation?: string;
  expectedResponseDate?: string;
  responderName: string;
  responderRole: string;
  responderEmail?: string;
  responderPhone?: string;
  checkCompletedDate: string;
}

interface RequestData {
  currentAddress?: {
    line1: string;
    line2?: string;
    town: string;
    postcode: string;
    moveInDate: string;
  };
  previousAddresses?: Array<{
    address: string;
    dateFrom: string;
    dateTo: string;
  }>;
  previousNames?: Array<{
    name: string;
    dateFrom: string;
    dateTo: string;
  }>;
  agencyName?: string;
  requesterName?: string;
  requesterRole?: string;
  role?: string;
  localAuthority?: string;
}

interface LASubmission {
  id: string;
  reference_id: string;
  applicant_name: string;
  local_authority: string;
  la_email: string;
  status: string;
  sent_at: string;
  completed_at: string | null;
  role: string;
  response_data: ResponseData | null;
  date_of_birth: string | null;
  request_data: RequestData | null;
}

interface PreviousAddress {
  address: string;
  dateFrom: string;
  dateTo: string;
}

interface AddressWithLA extends PreviousAddress {
  localAuthority: string;
  isCurrent: boolean;
  postcode: string;
}

type AddressesByLA = Record<string, AddressWithLA[]>;

interface LocalAuthorityCheckCardProps {
  parentId: string;
  parentType: "application" | "employee";
  applicantName: string;
  dateOfBirth: string;
  currentAddress: {
    line1: string;
    line2?: string;
    town: string;
    postcode: string;
    moveInDate: string;
  };
  previousAddresses?: Array<{
    address: string;
    dateFrom: string;
    dateTo: string;
  }>;
  previousNames?: Array<{
    name: string;
    dateFrom: string;
    dateTo: string;
  }>;
  localAuthority: string;
  role?: 'childminder' | 'household_member' | 'assistant' | 'manager' | 'nominated_individual';
}

// Helper to lookup Local Authority from postcode
const lookupPostcodeLA = async (postcode: string): Promise<string | null> => {
  try {
    const cleanPostcode = postcode.replace(/\s/g, "").toUpperCase();
    const response = await fetch(`https://api.postcodes.io/postcodes/${cleanPostcode}`);
    if (response.ok) {
      const data = await response.json();
      return data.result?.admin_district || null;
    }
    return null;
  } catch (error) {
    console.error("Error looking up postcode:", error);
    return null;
  }
};

// Helper to extract postcode from address string
const extractPostcode = (address: string): string | null => {
  // UK postcode regex pattern
  const postcodeRegex = /([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})/i;
  const match = address.match(postcodeRegex);
  return match ? match[1] : null;
};

export const LocalAuthorityCheckCard = ({
  parentId,
  parentType,
  applicantName,
  dateOfBirth,
  currentAddress,
  previousAddresses,
  previousNames,
  localAuthority,
  role = 'childminder',
}: LocalAuthorityCheckCardProps) => {
  const [submissions, setSubmissions] = useState<LASubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<LASubmission | null>(null);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null);
  
  // New state for grouped addresses
  const [addressesByLA, setAddressesByLA] = useState<AddressesByLA>({});
  const [loadingLAs, setLoadingLAs] = useState(true);
  const [selectedLA, setSelectedLA] = useState<string | null>(null);
  const [selectedAddresses, setSelectedAddresses] = useState<AddressWithLA[]>([]);

  const fetchSubmissions = async () => {
    try {
      const column = parentType === "application" ? "application_id" : "employee_id";
      const { data, error } = await supabase
        .from("la_form_submissions")
        .select("*")
        .eq(column, parentId)
        .order("sent_at", { ascending: false });

      if (error) throw error;
      setSubmissions((data as unknown as LASubmission[]) || []);
    } catch (error) {
      console.error("Error fetching LA submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group addresses by Local Authority
  const groupAddressesByLA = async () => {
    setLoadingLAs(true);
    const grouped: AddressesByLA = {};

    try {
      // Process current address
      if (currentAddress?.postcode) {
        const la = await lookupPostcodeLA(currentAddress.postcode);
        const laName = la || localAuthority || "Unknown";
        
        if (!grouped[laName]) grouped[laName] = [];
        grouped[laName].push({
          address: [currentAddress.line1, currentAddress.line2, currentAddress.town, currentAddress.postcode]
            .filter(Boolean)
            .join(", "),
          dateFrom: currentAddress.moveInDate,
          dateTo: "Present",
          localAuthority: laName,
          isCurrent: true,
          postcode: currentAddress.postcode,
        });
      }

      // Process previous addresses
      if (previousAddresses?.length) {
        for (const addr of previousAddresses) {
          const postcode = extractPostcode(addr.address);
          let la = postcode ? await lookupPostcodeLA(postcode) : null;
          const laName = la || "Unknown";
          
          if (!grouped[laName]) grouped[laName] = [];
          grouped[laName].push({
            ...addr,
            localAuthority: laName,
            isCurrent: false,
            postcode: postcode || "",
          });
        }
      }

      setAddressesByLA(grouped);
    } catch (error) {
      console.error("Error grouping addresses by LA:", error);
    } finally {
      setLoadingLAs(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    groupAddressesByLA();
  }, [parentId, parentType, currentAddress, previousAddresses]);

  const handleSendToLA = (laName: string, addresses: AddressWithLA[]) => {
    setSelectedLA(laName);
    setSelectedAddresses(addresses);
    setShowModal(true);
  };

  const handleDownloadPDF = async (submission: LASubmission) => {
    if (!submission.response_data || !submission.completed_at) return;
    
    setDownloadingPdf(submission.id);
    try {
      const blob = await pdf(
        <LAResponsePDF
          referenceId={submission.reference_id}
          applicantName={submission.applicant_name}
          dateOfBirth={submission.date_of_birth || ""}
          localAuthority={submission.local_authority}
          laEmail={submission.la_email}
          sentAt={submission.sent_at}
          completedAt={submission.completed_at}
          responseData={submission.response_data}
          requestData={submission.request_data || undefined}
        />
      ).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `la-response-${submission.reference_id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setDownloadingPdf(null);
    }
  };

  const handleViewResponse = (submission: LASubmission) => {
    setSelectedSubmission(submission);
    setShowResponseDialog(true);
  };

  const getResponseTypeLabel = (responseType: string) => {
    switch (responseType) {
      case "not_known":
        return "Not known to Children's Services";
      case "known_no_info":
        return "Known - No relevant information";
      case "known_with_info":
        return "Known - Relevant information held";
      case "unable_to_provide":
        return "Information held but unable to provide";
      default:
        return responseType;
    }
  };

  const pendingCount = submissions.filter(s => s.status === "pending").length;
  const completedCount = submissions.filter(s => s.status === "completed").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            {status}
          </Badge>
        );
    }
  };

  const getResponseBadge = (responseType: string) => {
    switch (responseType) {
      case "not_known":
        return <Badge className="bg-green-100 text-green-700">Not Known</Badge>;
      case "known_no_info":
        return <Badge className="bg-blue-100 text-blue-700">Known - No Info</Badge>;
      case "known_with_info":
        return <Badge className="bg-red-100 text-red-700">Known - Has Info</Badge>;
      case "unable_to_provide":
        return <Badge className="bg-amber-100 text-amber-700">Unable to Provide</Badge>;
      default:
        return null;
    }
  };

  // Get submissions for a specific LA
  const getSubmissionsForLA = (laName: string) => {
    return submissions.filter(s => s.local_authority === laName);
  };

  // Check if LA has a pending or completed submission
  const getLAStatus = (laName: string) => {
    const laSubmissions = getSubmissionsForLA(laName);
    if (laSubmissions.some(s => s.status === "completed")) return "completed";
    if (laSubmissions.some(s => s.status === "pending")) return "pending";
    return "not_sent";
  };

  const uniqueLAs = Object.keys(addressesByLA).filter(la => la !== "Unknown");
  const unknownAddresses = addressesByLA["Unknown"] || [];

  return (
    <>
      <AppleCard className="col-span-1 md:col-span-2 lg:col-span-1">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Local Authority Checks</h3>
                <p className="text-sm text-muted-foreground">
                  {uniqueLAs.length} {uniqueLAs.length === 1 ? 'authority' : 'authorities'} identified
                </p>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <div className="text-2xl font-bold">{submissions.length}</div>
              <div className="text-xs text-muted-foreground">Total Requests</div>
            </div>
            <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 p-4 text-center">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingCount}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="rounded-xl bg-green-50 dark:bg-green-900/20 p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedCount}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </div>

          {/* Local Authorities Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Local Authorities Identified</h4>
            
            {loadingLAs ? (
              <div className="flex items-center justify-center py-8 bg-muted/30 rounded-xl">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Looking up local authorities...</span>
              </div>
            ) : uniqueLAs.length === 0 ? (
              <div className="text-center py-8 bg-muted/30 rounded-xl">
                <Building2 className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">No addresses with valid postcodes found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {uniqueLAs.map((laName) => {
                  const addresses = addressesByLA[laName];
                  const laStatus = getLAStatus(laName);
                  const laSubmissions = getSubmissionsForLA(laName);
                  const latestSubmission = laSubmissions[0];

                  return (
                    <div
                      key={laName}
                      className="rounded-xl border border-border/50 bg-card overflow-hidden"
                    >
                      {/* LA Header */}
                      <div className="flex items-center justify-between p-4 bg-muted/30">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-sm">{laName}</h5>
                            <p className="text-xs text-muted-foreground">
                              {addresses.length} {addresses.length === 1 ? 'address' : 'addresses'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {laStatus === "completed" && (
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Completed
                            </Badge>
                          )}
                          {laStatus === "pending" && (
                            <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 gap-1">
                              <Clock className="h-3 w-3" />
                              Pending
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant={laStatus === "not_sent" ? "default" : "outline"}
                            className={laStatus === "not_sent" ? "gap-2 bg-purple-600 hover:bg-purple-700" : "gap-2"}
                            onClick={() => handleSendToLA(laName, addresses)}
                          >
                            <Send className="h-3 w-3" />
                            {laStatus === "not_sent" ? "Send Request" : "Send Again"}
                          </Button>
                        </div>
                      </div>

                      {/* Addresses List */}
                      <div className="p-3 space-y-2">
                        {addresses.map((addr, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 text-sm p-2 rounded-lg bg-muted/30"
                          >
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="truncate">{addr.address}</p>
                              <p className="text-xs text-muted-foreground">
                                {addr.isCurrent ? (
                                  <span className="text-green-600 dark:text-green-400 font-medium">Current address</span>
                                ) : (
                                  `${addr.dateFrom} — ${addr.dateTo}`
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Latest Submission for this LA */}
                      {latestSubmission && (
                        <div className="px-3 pb-3">
                          <div className="flex items-center justify-between p-2 rounded-lg border border-border/50 bg-background text-xs">
                            <div className="flex items-center gap-2">
                              <FileText className="h-3 w-3 text-muted-foreground" />
                              <span className="font-medium">{latestSubmission.reference_id}</span>
                              <span className="text-muted-foreground">
                                {format(new Date(latestSubmission.sent_at), "dd MMM yyyy")}
                              </span>
                            </div>
                            {latestSubmission.status === "completed" && latestSubmission.response_data && (
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleViewResponse(latestSubmission)}
                                  title="View Response"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleDownloadPDF(latestSubmission)}
                                  disabled={downloadingPdf === latestSubmission.id}
                                  title="Download PDF"
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Unknown LA addresses */}
                {unknownAddresses.length > 0 && (
                  <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <span className="font-medium text-sm text-amber-700 dark:text-amber-400">
                        Addresses with Unknown LA
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Unable to identify LA for these addresses. Please verify postcodes.
                    </p>
                    {unknownAddresses.map((addr, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground">
                        • {addr.address}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recent Submissions */}
          {submissions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">All Requests</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {submissions.slice(0, 5).map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">
                            {submission.reference_id}
                          </span>
                          {getStatusBadge(submission.status)}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {submission.local_authority}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(submission.sent_at), "dd MMM yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {submission.status === "completed" && submission.response_data && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleViewResponse(submission)}
                            title="View Response"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDownloadPDF(submission)}
                            disabled={downloadingPdf === submission.id}
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="rounded-xl bg-purple-50 dark:bg-purple-900/20 p-4 border border-purple-100 dark:border-purple-800">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-purple-900 dark:text-purple-100">About LA Children's Services Checks</p>
                <p className="text-purple-700 dark:text-purple-300 mt-1">
                  Requests are sent to each Local Authority separately, with only the addresses within their jurisdiction included. 
                  This ensures compliance and GDPR-friendly data sharing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AppleCard>

      <SendLAFormModal
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
          if (!open) {
            setSelectedLA(null);
            setSelectedAddresses([]);
          }
        }}
        applicantName={applicantName}
        dateOfBirth={dateOfBirth}
        currentAddress={currentAddress}
        previousAddresses={previousAddresses}
        previousNames={previousNames}
        role={role}
        localAuthority={selectedLA || localAuthority}
        targetAddresses={selectedAddresses}
        parentId={parentId}
        parentType={parentType}
        onSuccess={fetchSubmissions}
      />

      {/* Response View Dialog */}
      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-600" />
              LA Response - {selectedSubmission?.reference_id}
            </DialogTitle>
          </DialogHeader>
          
          {selectedSubmission?.response_data && (
            <div className="space-y-6">
              {/* Response Summary */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-3">Response Summary</h4>
                <div className="flex items-center gap-2 mb-3">
                  {getResponseBadge(selectedSubmission.response_data.responseType)}
                </div>
                <p className="text-sm">
                  {getResponseTypeLabel(selectedSubmission.response_data.responseType)}
                </p>
                <div className="mt-3 text-sm text-muted-foreground">
                  Check completed: {format(new Date(selectedSubmission.response_data.checkCompletedDate), "dd MMMM yyyy")}
                </div>
              </div>

              {/* Relevant Information (if any) */}
              {selectedSubmission.response_data.responseType === 'known_with_info' && 
               selectedSubmission.response_data.relevantInformation && (
                <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h4 className="font-semibold mb-2 text-red-700 dark:text-red-400">
                    Relevant Information
                  </h4>
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedSubmission.response_data.relevantInformation}
                  </p>
                </div>
              )}

              {/* Unable to provide info */}
              {selectedSubmission.response_data.responseType === 'unable_to_provide' && 
               selectedSubmission.response_data.expectedResponseDate && (
                <div className="p-4 border border-amber-200 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <h4 className="font-semibold mb-2 text-amber-700 dark:text-amber-400">
                    Expected Full Response
                  </h4>
                  <p className="text-sm">
                    The LA expects to provide a full response by: {' '}
                    {format(new Date(selectedSubmission.response_data.expectedResponseDate), "dd MMMM yyyy")}
                  </p>
                </div>
              )}

              {/* Responder Details */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">Responder Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-medium">{selectedSubmission.response_data.responderName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Role:</span>
                    <p className="font-medium">{selectedSubmission.response_data.responderRole}</p>
                  </div>
                  {selectedSubmission.response_data.responderEmail && (
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <p className="font-medium">{selectedSubmission.response_data.responderEmail}</p>
                    </div>
                  )}
                  {selectedSubmission.response_data.responderPhone && (
                    <div>
                      <span className="text-muted-foreground">Phone:</span>
                      <p className="font-medium">{selectedSubmission.response_data.responderPhone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Download Button */}
              <Button 
                className="w-full gap-2"
                onClick={() => handleDownloadPDF(selectedSubmission)}
                disabled={downloadingPdf === selectedSubmission.id}
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
