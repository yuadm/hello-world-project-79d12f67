import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import serviceBlocksImage from "@/assets/service-blocks.jpg";

const whyJoin = [
  { icon: "fa-briefcase", title: "Flexible Career Path", description: "Create a schedule that fits your life, whether you provide care from your home or an approved community space." },
  { icon: "fa-piggy-bank", title: "Competitive Earnings", description: "Set your own fees and maximise your income by offering high‑value services families truly appreciate." },
  { icon: "fa-graduation-cap", title: "Training & Support", description: "Access comprehensive onboarding, CPD courses and business mentoring to help your practice thrive." },
  { icon: "fa-bullhorn", title: "Marketing & Business Tools", description: "Benefit from our brand presence, online platform and promotional support to connect with families quickly." },
  { icon: "fa-people-group", title: "Community & Networking", description: "Join a professional community, attend events and collaborate with peers to share ideas and best practice." },
];

const whatWeLookFor = [
  { title: "Passion for Early Years", description: "A love for working with children and a commitment to nurturing their growth and happiness." },
  { title: "Willingness to Learn", description: "An open mindset to training, workshops and continuous professional development." },
  { title: "Commitment to Safety", description: "Adhering to safeguarding, health and safety and EYFS regulations at all times." },
  { title: "Ready Kids Agency Registration", description: "We guide you through registering with Ready Kids so you meet all legal requirements." },
];

const howToBecome = [
  { icon: "fa-file-lines", title: "Start Your Application", description: "Submit your interest online. We'll review your details and arrange an introductory call." },
  { icon: "fa-id-badge", title: "Complete Registration", description: "Undergo enhanced DBS checks, health declarations and professional references. Complete training in EYFS, safeguarding and first aid." },
  { icon: "fa-house-circle-check", title: "Set Up Your Service", description: "Whether at home or in an approved community space, we'll help you create a safe, inspiring environment." },
  { icon: "fa-handshake-simple", title: "Join Our Community", description: "Once registered, access resources, marketing tools and ongoing support to grow your practice." },
];

const typesOfChildminding = [
  { title: "Domestic Premises", description: "Deliver care from your own home, creating a homely and familiar environment for children." },
  { title: "Non‑Domestic Premises", description: "Operate from approved community halls, outdoor spaces or other non‑residential locations for greater scale and flexibility." },
  { title: "Combined Care", description: "Offer a mix of domestic and non‑domestic care, adapting to families' needs while growing your business." },
];

const valueAddingServices = [
  { icon: "fa-clock", title: "Extended Hours", description: "Provide early morning or late evening care to suit working parents' schedules." },
  { icon: "fa-music", title: "Educational Enrichment", description: "Offer language lessons, music classes or STEM workshops to stimulate learning." },
  { icon: "fa-apple-whole", title: "Healthy Meals", description: "Prepare nutritious and balanced meals so children develop healthy eating habits." },
  { icon: "fa-heart-circle-plus", title: "Therapeutic Support", description: "If you have specialist qualifications, offer services like speech or occupational therapy to children with specific needs." },
];

const Childminders = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[55vh] flex items-center justify-center pt-20">
          <div className="absolute inset-0 z-0">
            <img src={serviceBlocksImage} alt="Childminder with children" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-foreground/60" />
          </div>
          <div className="relative z-10 text-center text-primary-foreground px-4 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4">Become a ReadyKids Childminder</h1>
            <p className="text-xl opacity-90 mb-8">Be your own boss, shape young futures and build a rewarding career in childcare.</p>
            <NavLink to="/apply">
              <Button size="lg" variant="secondary">Start Your Application</Button>
            </NavLink>
          </div>
        </section>

        {/* Why Join */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-poppins text-center mb-4">Why Join ReadyKids?</h2>
            <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
              As a ReadyKids childminder you'll enjoy the freedom to run your own business with the confidence of a supportive agency behind you.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {whyJoin.map((item, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <i className={`fa-solid ${item.icon} text-2xl text-primary`}></i>
                    </div>
                    <CardTitle className="font-poppins">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What We Look For */}
        <section className="py-16 bg-foreground text-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-poppins text-center mb-4">What We Look For</h2>
            <p className="text-lg opacity-80 text-center max-w-3xl mx-auto mb-12">
              We work with dedicated individuals who share our vision of safe, high‑quality childcare. If you're passionate about children's development and willing to learn, we want to hear from you.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whatWeLookFor.map((item, index) => (
                <Card key={index} className="bg-card text-card-foreground">
                  <CardHeader>
                    <CardTitle className="font-poppins text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How to Become */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-poppins text-center mb-12">How to Become a Childminder</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howToBecome.map((item, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <i className={`fa-solid ${item.icon} text-2xl text-primary`}></i>
                    </div>
                    <CardTitle className="font-poppins">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Types of Childminding */}
        <section className="py-16 bg-foreground text-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-poppins text-center mb-4">Types of Childminding</h2>
            <p className="text-lg opacity-80 text-center max-w-3xl mx-auto mb-12">
              ReadyKids offers three pathways so you can provide care in the setting that best suits you and the families you work with.
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {typesOfChildminding.map((item, index) => (
                <Card key={index} className="bg-card text-card-foreground">
                  <CardHeader>
                    <CardTitle className="font-poppins">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Value Adding Services */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-poppins text-center mb-4">Value‑Adding Services</h2>
            <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
              Differentiate your practice and provide exceptional value with specialist services that families love.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {valueAddingServices.map((item, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <i className={`fa-solid ${item.icon} text-2xl text-primary`}></i>
                    </div>
                    <CardTitle className="font-poppins">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Childminders;
