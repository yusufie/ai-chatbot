"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { socialButtonsData } from "./socialButtonsData";
import Image from "next/image";

const LoginForm: React.FC = () => {

  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (providerId: string) => {
    setIsLoading(true);
	  await signIn(providerId, { callbackUrl: "/" });
	};


	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		const email = new FormData(e.currentTarget).get("email") as string;

		signIn("email", { email, callbackUrl: "/" });
	};

  return (
    <section className="flex items-center justify-center h-screen bg-background">
      <div className="flex flex-col items-center justify-center gap-20 w-full max-w-96 p-8 rounded-2xl bg-accent">

      {/* <Image src="/logo.png" alt="logo" width={121} height={126} className="" /> */}

      <h1 className="">Giriş Yapınız</h1>

      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-96">

        <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-2 w-full max-w-96">

          <input type="email" name="email" required autoFocus
            placeholder="E-posta adresi giriniz..."
            className="w-full h-12 py-2 px-4 rounded-md border-none outline-none font-semibold focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          />

          <button className=" flex flex-row items-center justify-center relative w-full h-12 rounded-md border-none cursor-pointer bg-[#109010] font-semibold text-base"
            type="submit" disabled={isLoading}
          >
            <Image src="/icons/mail-white.svg" alt="email" width={32} height={32} 
              className="absolute left-4"
            />
            <span>{isLoading ? "Giriş Yapılıyor... " : "Giriş Yap"}</span>
          </button>

        </form>

        <div className="flex flex-row items-center justify-center gap-20 w-full h-8">
          <hr className="bg-foreground rotate-90 h-24 w-[1px]" />
          <span className="">veya</span>
          <hr className="bg-foreground rotate-90 h-24 w-[1px]" />
        </div>

        <div className="flex flex-col items-center justify-center gap-4 w-full max-w-96">
          {socialButtonsData.map((button) => (
            <button
              key={button.id}
              className={`"flex flex-row items-center justify-center relative w-full h-12 rounded-md border-none cursor-pointer" ${button.color} ${button.background}`}
              onClick={() => handleSignIn(button.id)}
            >
              <Image src={button.icon} alt={button.id} width={28} height={28} 
                className="absolute left-4"
              />
              <span>{button.title}</span>
            </button>
          ))}
        </div>

      </div>

      </div>
    </section>
  )
}

export default LoginForm