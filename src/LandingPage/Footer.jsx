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
        { label: "Confidentiality", path: "/terms&conditions" },
        { label: "Privacy Policy", path: "/terms&conditions" },
        // { label: "Refund Policy", path: "/terms&conditions" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-white border-t border-gray-100 antialiased">
      <div className="container mx-auto px-4 lg:px-12 py-12 lg:pb-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-5 max-w-[320px]">
            <img
              src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/landingPage/image%2033%201%20(1)%201.png?updatedAt=1771313237021"
              alt="Insight Consulting Logo"
              className="w-40 object-contain"
            />
            <p className="text-gray-600 text-sm leading-relaxed">
              Simplifying business registrations, taxation, and compliance with
              reliable expert support you can trust.
            </p>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col gap-5">
            <h4 className="text-gray-800 text-sm font-semibold uppercase tracking-wide">
              Contact
            </h4>

            {/* Address */}
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 mt-0.5 shrink-0 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z"
                />
                <circle
                  cx="12"
                  cy="8"
                  r="2"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
              <p className="text-gray-600 text-sm leading-relaxed">
                Insight Consulting <br />
                Flat No 6, Door No 6 <br />
                Second Floor, Radial House <br />
                14/1, Welcome Colony <br />
                Anna Nagar West Extension <br />
                Chennai – 600101
              </p>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 shrink-0 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5.5C3 14.06 9.94 21 18.5 21c.386 0 .77-.014 1.15-.04.386-.028.73-.216.963-.52l1.912-2.548a1 1 0 00-.028-1.248l-2.4-2.8a1 1 0 00-1.277-.196l-2.193 1.317A9.96 9.96 0 0110.37 9.37L11.686 7.177a1 1 0 00-.196-1.277l-2.8-2.4a1 1 0 00-1.248-.028L4.894 5.384A1.5 1.5 0 003 5.5z"
                />
              </svg>
              <a
                href="tel:+917339009906"
                className="text-gray-700 text-sm font-medium hover:text-primary transition-colors"
              >
                +91 73390 09906
              </a>
            </div>

           {/* Enquiry */}
<div className="flex items-start gap-3 group">
  <svg
    className="w-5 h-5 mt-0.5 shrink-0 text-gray-400 group-hover:text-primary transition-colors"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
  <div>
    <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Enquiry</p>
    <a
      href="mailto:enquiry@insightconsulting.info"
      className="text-gray-700 text-sm font-medium hover:text-primary transition-colors break-all"
    >
      enquiry@insightconsulting.info
    </a>
  </div>
</div>

{/* Help-desk */}
<div className="flex items-start gap-3 group">
  <svg
    className="w-5 h-5 mt-0.5 shrink-0 text-gray-400 group-hover:text-primary transition-colors"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18.364 5.636L16.95 7.05A7 7 0 1016.95 16.95l1.414 1.414M12 15.5v-7m0 0l-2 2m2-2l2 2"
    />
  </svg>
  <div>
    <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Help-desk</p>
    <a
      href="mailto:support@insightconsulting.info"
      className="text-gray-700 text-sm font-medium hover:text-primary transition-colors break-all"
    >
      support@insightconsulting.info
    </a>
  </div>
</div>
          </div>

          {/* Map Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-gray-800 text-sm font-semibold uppercase tracking-wide">
              📍 Location
            </h4>

            <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.184153781989!2d80.1957386!3d13.0875126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265f17e762bbb%3A0xa91a1073eeb6a55d!2sAccuTant%20FinTax%20Academy%20-%20Business%20Accounting%20and%20Taxation%20Course%20%7C%20Accounting%20Course%20%7C%20Placements%20%7C%20Audit%20%26%20Tax%20Consultant!5e0!3m2!1sen!2sin!4v1776670300789!5m2!1sen!2sin"
                width="100%"
                height="180"
                style={{ border: 0 }}
                loading="lazy"
                className="w-full"
                title="Google Map of AccuTant FinTax Academy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <a
              href="https://maps.google.com?q=AccuTant+FinTax+Academy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1 w-fit"
            >
              Open in Google Maps
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>

          {/* Links Columns (Quick Links + Legal) */}
          <div className="grid grid-cols-2 gap-8">
            {footerData.map((col) => (
              <div key={col.title} className="flex flex-col gap-4">
                <h4 className="text-gray-800 text-sm font-semibold uppercase tracking-wide">
                  {col.title}
                </h4>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.path}
                        className="text-gray-600 text-sm hover:text-primary transition-colors"
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

        {/* Bottom Bar – Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-100 text-center text-gray-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            © {new Date().getFullYear()} Insight Consulting. All rights
            reserved.
          </p>

          <p>
            Crafted by{" "}
            <a
              href="https://webzspot.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:underline"
            >
              WebzSpot
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
