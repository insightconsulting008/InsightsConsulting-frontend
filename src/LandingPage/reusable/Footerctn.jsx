import React from 'react'
import { useNavigate } from 'react-router-dom'

const Footerctn = () => {
    const navigate =useNavigate()
  return (
    <div>
        
        <section className="w-full pt-[64px] container pb-[48px]">
        <div className=" lg:px-12 px-4 mx-auto ">

          <div className=" mx-auto flex flex-col lg:flex-row justify-between items-center lg:items-start gap-[32px]">

            <div className="flex flex-col gap-[16px] text-center lg:text-left">
              <h2 className="text-[#181D27] text-[24px] lg:text-[30px] leading-[38px] font-semibold tracking-[-0.02em]">
                Simplify Your Business Compliance Today
              </h2>

              <p className="text-[#535862] text-[18px] lg:text-[20px] leading-[30px] font-normal">
                Trusted by businesses for registrations, filings, and regulatory support.
              </p>
            </div>


            <div className="flex flex-col flex-row items-center justify-center gap-[12px] w-full lg:w-auto">

              <button  onClick={() => navigate("/about")} className="w-full sm:w-[128px] h-[48px] border border-[#D5D7DA] rounded-[8px] text-[#414651] font-semibold shadow-sm hover:bg-gray-50 transition-all">
                Learn more
              </button>


              <button  onClick={() => navigate("/login")} className="w-full sm:w-[129px] h-[48px] bg-[#D11C16] border border-[#D11C16] rounded-[8px] text-white font-semibold shadow-sm hover:bg-[#b01712] transition-all">
                Get started
              </button>
            </div>

          </div>
        </div>
      </section>

      {/*Divider*/}
      <div className=" mx-auto px-4 lg:px-12">
        <div className=" mx-auto h-[1px] bg-[#E9EAEB]"></div>
      </div>
    </div>
  )
}

export default Footerctn