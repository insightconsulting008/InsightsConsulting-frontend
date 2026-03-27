import React from 'react'
import { useNavigate } from 'react-router-dom'

const Footerctn = () => {
  const navigate = useNavigate()
  return (
    <div>
      <section className="w-full pt-[64px] pb-[48px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">

            {/* Text */}
            <div className="flex flex-col gap-[16px] text-center lg:text-left max-w-xl">
              <h2 className="text-[#181D27] text-[24px] lg:text-[30px] leading-[38px] font-semibold tracking-[-0.02em]">
                Simplify Your Business Compliance Today
              </h2>
              <p className="text-[#535862] text-[16px] lg:text-[18px] leading-[28px] font-normal">
                Trusted by businesses for registrations, filings, and regulatory support.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-row items-center justify-center gap-[12px] shrink-0">
              <button
                onClick={() => navigate("/about")}
                className="h-[48px] px-6 border border-[#D5D7DA] rounded-[8px] text-[#414651] font-semibold shadow-sm hover:bg-gray-50 transition-all whitespace-nowrap"
              >
                Learn more
              </button>
              <button
                onClick={() => navigate("/login")}
                className="h-[48px] px-6 bg-[#D11C16] border border-[#D11C16] rounded-[8px] text-white font-semibold shadow-sm hover:bg-[#b01712] transition-all whitespace-nowrap"
              >
                Get started
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[1px] bg-[#E9EAEB]"></div>
      </div>
    </div>
  )
}

export default Footerctn
