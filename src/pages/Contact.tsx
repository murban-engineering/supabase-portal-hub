import Layout from "@/components/Layout";

const Contact = () => {
  const contactInfo = [
    {
      value: "info@murban-eng.com",
      label: "Email Address",
      href: "mailto:info@murban-eng.com",
    },
    {
      value: "+ 254 20 265 0618",
      label: "Phone Number",
      href: "tel:+254202650618",
    },
    {
      value: "Off Airport Road, Mombasa Port Reitz",
      label: "Address",
      href: null,
    },
  ];
  
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="w-full max-w-3xl animate-fade-in">
          <div className="space-y-16">
            {contactInfo.map((item, index) => (
              <div 
                key={index}
                className="border-l-2 border-muted-foreground/20 pl-8 py-2"
              >
                {item.href ? (
                  <a 
                    href={item.href}
                    className="contact-value hover:text-white transition-colors block"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="contact-value">{item.value}</p>
                )}
                <p className="contact-label">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
