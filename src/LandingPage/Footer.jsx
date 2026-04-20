import React from "react";

const Footer = () => {
  const footerData = [
    {
      title: "Quick Links",
      links: [
        { label: "Home", path: "/" },
        { label: "Blog", path: "/resource" },
        { label: "Contact", path: "/contact" },
        { label: "About Us", path: "/company" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms & Conditions", path: "/terms&conditions" },
        { label: "Privacy Policy", path: "/terms&conditions" },
        { label: "Refund Policy", path: "/terms&conditions" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-white container mx-auto antialiased">
      <section className="w-full pt-[64px] pb-[48px]">
        <div className="mx-auto lg:px-12 px-4">
          
          {/* MAIN GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[48px]">

            {/* Brand */}
            <div className="flex flex-col gap-[24px] max-w-[320px]">
              <img
                src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/image%2033%201%20(1)%201.png?updatedAt=1771313237021"
                alt="Logo"
                className="w-40 object-contain"
              />

              <p className="text-muted text-[16px] leading-[24px]">
                Simplifying business registrations, taxation, and compliance with reliable expert support you can trust.
              </p>
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-[16px]">

              {/* Address */}
              <div className="flex items-start gap-[10px]">
                <svg className="w-[18px] h-[18px] mt-[3px] shrink-0 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z" />
                  <circle cx="12" cy="8" r="2" fill="currentColor" stroke="none" />
                </svg>
                <p className="text-muted text-[15px] leading-[24px]">
                  Flat No 6, Door No 6, Block 14, 2nd Floor,<br />
                  Welcome Colony, Anna Nagar West Ext,<br />
                  Chennai – 600101
                </p>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-[10px]">
                <svg className="w-[18px] h-[18px] shrink-0 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5.5C3 14.06 9.94 21 18.5 21c.386 0 .77-.014 1.15-.04.386-.028.73-.216.963-.52l1.912-2.548a1 1 0 00-.028-1.248l-2.4-2.8a1 1 0 00-1.277-.196l-2.193 1.317A9.96 9.96 0 0110.37 9.37L11.686 7.177a1 1 0 00-.196-1.277l-2.8-2.4a1 1 0 00-1.248-.028L4.894 5.384A1.5 1.5 0 003 5.5z" />
                </svg>
                <a href="tel:+917339009906" className="text-muted text-[15px] font-semibold hover:text-black">
                  +91 73390 09906
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-[10px]">
                <svg className="w-[18px] h-[18px] shrink-0 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:revathyb@insightconsulting.info" className="text-muted text-[15px] font-semibold break-all">
                  revathyb@insightconsulting.info
                </a>
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-[32px]">
              {footerData.map((col) => (
                <div key={col.title} className="flex flex-col gap-[16px]">
                  <h4 className="text-subtle text-[14px] font-semibold">
                    {col.title}
                  </h4>

                  <ul className="flex flex-col gap-[12px]">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.path}
                          className="text-muted text-[16px] font-semibold hover:text-black"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;