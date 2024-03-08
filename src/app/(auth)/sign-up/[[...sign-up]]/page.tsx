"use client";

import { useSignIn, useSignUp, useAuth } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import type { SVGProps } from "react";

const GoogleSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <g clipPath="url(#a)">
      <mask
        id="b"
        width={20}
        height={20}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "luminance",
        }}
      >
        <path
          fill="#fff"
          d="M19.63 8.182h-9.317v3.864h5.363c-.5 2.454-2.59 3.863-5.364 3.863A5.897 5.897 0 0 1 4.404 10a5.897 5.897 0 0 1 5.91-5.91c1.409 0 2.681.5 3.681 1.32l2.91-2.91C15.13.955 12.857 0 10.312 0c-5.546 0-10 4.455-10 10 0 5.546 4.454 10 10 10 5 0 9.545-3.636 9.545-10 0-.59-.09-1.227-.227-1.818Z"
        />
      </mask>
      <g mask="url(#b)">
        <path fill="#FBBC05" d="M-.597 15.91V4.09L7.131 10l-7.728 5.91Z" />
      </g>
      <mask
        id="c"
        width={20}
        height={20}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "luminance",
        }}
      >
        <path
          fill="#fff"
          d="M19.63 8.182h-9.317v3.864h5.363c-.5 2.454-2.59 3.863-5.364 3.863A5.897 5.897 0 0 1 4.404 10a5.897 5.897 0 0 1 5.91-5.91c1.409 0 2.681.5 3.681 1.32l2.91-2.91C15.13.955 12.857 0 10.312 0c-5.546 0-10 4.455-10 10 0 5.546 4.454 10 10 10 5 0 9.545-3.636 9.545-10 0-.59-.09-1.227-.227-1.818Z"
        />
      </mask>
      <g mask="url(#c)">
        <path
          fill="#EA4335"
          d="M-.597 4.09 7.131 10l3.181-2.773 10.91-1.772V-.91H-.598v5Z"
        />
      </g>
      <mask
        id="d"
        width={20}
        height={20}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "luminance",
        }}
      >
        <path
          fill="#fff"
          d="M19.63 8.182h-9.317v3.864h5.363c-.5 2.454-2.59 3.863-5.364 3.863A5.897 5.897 0 0 1 4.404 10a5.897 5.897 0 0 1 5.91-5.91c1.409 0 2.681.5 3.681 1.32l2.91-2.91C15.13.955 12.857 0 10.312 0c-5.546 0-10 4.455-10 10 0 5.546 4.454 10 10 10 5 0 9.545-3.636 9.545-10 0-.59-.09-1.227-.227-1.818Z"
        />
      </mask>
      <g mask="url(#d)">
        <path
          fill="#34A853"
          d="M-.597 15.91 13.04 5.454l3.59.454 4.591-6.818v21.818H-.597v-5Z"
        />
      </g>
      <mask
        id="e"
        width={20}
        height={20}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "luminance",
        }}
      >
        <path
          fill="#fff"
          d="M19.63 8.182h-9.317v3.864h5.363c-.5 2.454-2.59 3.863-5.364 3.863A5.897 5.897 0 0 1 4.404 10a5.897 5.897 0 0 1 5.91-5.91c1.409 0 2.681.5 3.681 1.32l2.91-2.91C15.13.955 12.857 0 10.312 0c-5.546 0-10 4.455-10 10 0 5.546 4.454 10 10 10 5 0 9.545-3.636 9.545-10 0-.59-.09-1.227-.227-1.818Z"
        />
      </mask>
      <g mask="url(#e)">
        <path
          fill="#4285F4"
          d="M21.222 20.91 7.13 10 5.312 8.636l15.91-4.545v16.818Z"
        />
      </g>
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);

const GoogleSignUpButton = () => {
  const { signUp } = useSignUp();
  return (
    <button
      className="flex w-full items-center gap-x-3 rounded-xl border border-gray-300 px-5 py-3 font-normal text-gray-700"
      onClick={async () => {
        await signUp?.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/",
        });
      }}
    >
      <GoogleSvg /> Continue with Google
    </button>
  );
};

const SignInButton = () => {
  const { signIn } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  return (
    <button
      className="font-medium text-[#172554]"
      onClick={async () => {
        if (isSignedIn) {
          router.push("/");
        }
        await signIn?.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/",
        });
      }}
    >
      Sign In
    </button>
  );
};

export default function Page() {
  return (
    <div className="container flex h-screen items-center justify-center">
      <div className="flex-col items-start space-y-7">
        <div className="flex-col space-y-[4px]">
          <h2 className="text-3xl font-medium leading-10">
            Join the best community ever
          </h2>
          <p className="text-lg font-normal leading-8 text-gray-600">
            Create an account today
          </p>
        </div>
        <GoogleSignUpButton />
        <div className="text-gray-700">
          Already have an account? <SignInButton />
        </div>
      </div>
    </div>
  );
}
