import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Footer() {
  const router = useRouter();
  return (
    <div className="bg-gray-100 flex flex-col md:flex-row justify-center items-center gap-2 md:justify-between py-4 border-t px-4 md:px-8">
      <div className="flex gap-3 items-center justify-center flex-wrap">
        <Link href="/policies">
          <a>
            <div className="text-gray-900 cursor-pointer hover:text-blue-700 hover:underline transition-all duration-100 ease-linear">
              Policies
            </div>
          </a>
        </Link>

        <Link href="/safety">
          <a>
            <div className="text-gray-900 cursor-pointer hover:text-blue-700 hover:underline transition-all duration-100 ease-linear">
              Safety
            </div>
          </a>
        </Link>

        <Link href="/about-us">
          <a>
            <div className="text-gray-900 cursor-pointer hover:text-blue-700 hover:underline transition-all duration-100 ease-linear">
              About us
            </div>
          </a>
        </Link>

        <Link href="/terms-of-service">
          <a>
            <div className="text-gray-900 cursor-pointer hover:text-blue-700 hover:underline transition-all duration-100 ease-linear">
              Terms of service
            </div>
          </a>
        </Link>

        <Link href="/privacy-policy">
          <a>
            <div className="text-gray-900 cursor-pointer hover:text-blue-700 hover:underline transition-all duration-100 ease-linear">
              Privacy policy
            </div>
          </a>
        </Link>

        <Link href="/payment-terms">
          <a>
            <div className="text-gray-900 cursor-pointer hover:text-blue-700 hover:underline transition-all duration-100 ease-linear">
              Payment terms
            </div>
          </a>
        </Link>

        <Link href="/contact-us">
          <a>
            <div className="text-gray-900 cursor-pointer hover:text-blue-700 hover:underline transition-all duration-100 ease-linear">
              Contact us
            </div>
          </a>
        </Link>
      </div>
      <div className="flex gap-4 self-center">
        <Link rel="canonical" href="https://www.facebook.com/winda.travel">
          <a target="_blank">
            <svg
              className="social-icon"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              version="1.1"
            >
              <title>facebook</title>
              <desc>Created with Sketch.</desc>
              <defs />
              <g
                id="Page-1"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
                strokeLinejoin="round"
              >
                <g
                  id="Artboard-4"
                  transform="translate(-796.000000, -863.000000)"
                  stroke="#333333"
                  strokeWidth="2"
                >
                  <g id="358" transform="translate(796.000000, 863.000000)">
                    <path
                      id="Path-287"
                      d="M18,1.5 C18,1.5 16.4999664,1 15.5,1 C12,1 9,3 9,6 L9,9 L6.0093689,9 C5.45190985,9 5,9.44335318 5,10.0093689 L5,11.9906311 C5,12.5480902 5.44335318,13 6.0093689,13 L9,13 L9,22.0046024 C9,22.5543453 9.44335318,23 10.0093689,23 L11.9906311,23 C12.5480902,23 13,22.5443356 13,22.0046024 L13,13 L15.9906311,13 C16.5480902,13 17.1070175,12.5719299 17.2420721,12.0317116 L17.7579279,9.96828842 C17.8916206,9.43351749 17.5562834,9 17.0001925,9 L13,9 L13,7 C13,5.8954305 13.8938998,5 15.0048815,5 L18,5 L18,1.5 Z"
                    />
                  </g>
                </g>
              </g>
            </svg>
          </a>
        </Link>

        <Link href="https://twitter.com/winda_guide">
          <a target="_blank">
            <svg
              className="social-icon"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              version="1.1"
            >
              <title>twitter</title>
              <desc>Created with Sketch.</desc>
              <defs />
              <g
                id="Page-1"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
                strokeLinejoin="round"
              >
                <g
                  id="Artboard-4"
                  transform="translate(-752.000000, -863.000000)"
                  stroke="#333333"
                  strokeWidth="2"
                  fillRule="nonzero"
                >
                  <g id="357" transform="translate(752.000000, 863.000000)">
                    <path
                      id="Shape"
                      d="M19.9648,8.50524978 C19.9648,8.33039473 20,7.5 20,7 C20.8565952,6.49511161 21.1936988,5.41413699 21.5,4.4786058 C20.694526,4.94918272 19.7605169,5.09519202 18.8416,5.27358196 C17.5696662,3.94200114 15.5485755,3.61609205 13.9116394,4.4786058 C12.2747034,5.34111954 11.42902,7.17755314 11.8488,8.9581401 C8.54951659,8.79529613 5.47558062,7.26104056 3.392,4.73720229 C2.30289821,6.58313971 2.85919031,8.94463962 4.6624,10.1301415 C4.00939296,10.1110867 3.3706235,9.9376538 2.8,9.6244796 L2.8,9.6756759 C2.80053451,11.5987608 4.17740119,13.2551124 6.092,13.6359064 C5.48789568,13.7981121 4.85406447,13.8218232 4.2392,13.7052183 C4.77675834,15.3509216 6.31725965,16.4783121 8.0728,16.5107754 C6.61978803,17.6350713 4.82484761,18.2454066 2.9768,18.2435732 C2.65032286,18.2429561 2.32416325,18.2234944 2,18.1852882 C3.87650876,19.3708972 6.05993072,19.999777 8.2896,19.9968495 C15.8368,20 19.9648,13.8438421 19.9648,8.50524978 Z"
                    />
                  </g>
                </g>
              </g>
            </svg>
          </a>
        </Link>

        <Link href="https://www.instagram.com/winda.guide/">
          <a target="_blank">
            <svg
              className="social-icon"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              version="1.1"
            >
              <title>instagram</title>
              <desc>Created with Sketch.</desc>
              <defs />
              <g
                id="Page-1"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                <g
                  id="Artboard-4"
                  transform="translate(-708.000000, -863.000000)"
                >
                  <g id="356" transform="translate(708.000000, 863.000000)">
                    <path
                      id="Fill-1"
                      d="M11.9968631,3.00315476 C9.55259199,3.00315476 9.24610244,3.01351517 8.28615675,3.05731471 C7.32821168,3.10100706 6.67396957,3.2531622 6.10150326,3.47566097 C5.50967369,3.70562637 5.00776535,4.01336632 4.50739321,4.51370273 C4.00705679,5.01407487 3.69931685,5.51598321 3.46935145,6.10781278 C3.24685268,6.68027909 3.09469754,7.3345212 3.05100518,8.29246627 C3.00720565,9.25241197 2.99684524,9.55890152 2.99684524,12.0031726 C2.99684524,14.447408 3.00720565,14.7538976 3.05100518,15.7138433 C3.09469754,16.6717883 3.24685268,17.3260304 3.46935145,17.8984967 C3.69931685,18.4903263 4.00705679,18.9922347 4.50739321,19.4926068 C5.00776535,19.9929432 5.50967369,20.3006831 6.10150326,20.5306843 C6.67396957,20.7531473 7.32821168,20.9053025 8.28615675,20.9489948 C9.24610244,20.9927944 9.55259199,21.0031548 11.9968631,21.0031548 C14.4410985,21.0031548 14.747588,20.9927944 15.7075337,20.9489948 C16.6654788,20.9053025 17.3197209,20.7531473 17.8921872,20.5306843 C18.4840168,20.3006831 18.9859251,19.9929432 19.4862973,19.4926068 C19.9866337,18.9922347 20.2943736,18.4903263 20.5243748,17.8984967 C20.7468378,17.3260304 20.8989929,16.6717883 20.9426853,15.7138433 C20.9864848,14.7538976 20.9968452,14.447408 20.9968452,12.0031726 C20.9968452,9.55890152 20.9864848,9.25241197 20.9426853,8.29246627 C20.8989929,7.3345212 20.7468378,6.68027909 20.5243748,6.10781278 C20.2943736,5.51598321 19.9866337,5.01407487 19.4862973,4.51370273 C18.9859251,4.01336632 18.4840168,3.70562637 17.8921872,3.47566097 C17.3197209,3.2531622 16.6654788,3.10100706 15.7075337,3.05731471 C14.747588,3.01351517 14.4410985,3.00315476 11.9968631,3.00315476 Z"
                      stroke="#333333"
                      strokeWidth="2"
                    />
                    <circle
                      id="Oval-204"
                      stroke="#333333"
                      strokeWidth="2"
                      cx="12"
                      cy="12"
                      r="4"
                    />
                    <circle
                      id="Oval-205"
                      fill="#333333"
                      cx="17.25"
                      cy="6.75"
                      r="1.25"
                    />
                  </g>
                </g>
              </g>
            </svg>
          </a>
        </Link>
      </div>
    </div>
  );
}
