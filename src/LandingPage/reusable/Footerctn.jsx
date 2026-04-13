import React from 'react'
import { useNavigate } from 'react-router-dom'

const Footerctn = () => {
  const navigate = useNavigate()

  return (
    <div>
      <section className="w-full pt-[72px] pb-[56px] bg-[linear-gradient(180deg,#F8FAFF_0%,#EEF4FF_100%)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-12">

          <div className="flex flex-col lg:flex-row justify-between items-center gap-10">

            {/* Text */}
            <div className="flex flex-col gap-4 text-center lg:text-left max-w-xl">
              <h2 className="text-bodydark text-[26px] lg:text-[34px] leading-tight font-semibold tracking-[-0.02em]">
                Partner with Insight Consulting
              </h2>

              <p className="text-muted text-[16px] lg:text-[18px] leading-relaxed">
                Where clarity meets growth — simplify your compliance journey with expert guidance.
              </p>
            </div>

            {/* Button */}
            <div className="flex items-center justify-center shrink-0">
              <button
                onClick={() => navigate("/login")}
                className="h-[50px] px-7 bg-primary text-white font-semibold rounded-xl 
                shadow-[0_6px_20px_rgba(37,99,235,0.25)]
                hover:shadow-[0_10px_30px_rgba(37,99,235,0.35)]
                hover:-translate-y-[1px]
                transition-all duration-300 whitespace-nowrap"
              >
                Get Started →
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 lg:px-12">
        <div className="h-[1px] bg-border/70"></div>
      </div>
    </div>
  )
}

export default Footerctn