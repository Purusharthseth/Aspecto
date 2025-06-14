"use client";
import React from "react";
import { Github } from 'lucide-react';
import Link from "next/link";


export default function Home() {

  return (
    <main className="min-h-screen bg-base-200 text-base-content">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-md">
        <div className="flex-1">
          <span className="p-5 text-xl">Aspecto</span>
        </div>
        <div className="flex-none gap-2">
          <Link href="/sign-in" className="btn btn-outline btn-primary mr-3">
            Sign in
          </Link>
          <Link href="/sign-up" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero min-h-[60vh] bg-base-200">
        <div className="hero-content flex-col lg:flex-row gap-12">
          {/* Left: Text */}
          <div className="w-full max-w-xl flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl font-bold mb-4">AI-powered Media Tools</h1>
            <p className="py-4 text-lg text-gray-300">
              Upload videos and images. Crop intelligently, remove backgrounds, and more — all powered by AI.
            </p>
            <Link href="/sign-up" className="btn btn-primary btn-lg mt-2">
              Try it now
            </Link>
          </div>
          {/* Right: Image or Screenshot */}
          <div className="w-full max-w-md flex justify-center">
            <img
              src="/Aspectoss2.png"
              alt="App screenshot"
              className="rounded-2xl shadow-2xl border border-base-300 bg-base-100"
              style={{ objectFit: "cover", maxHeight: 350 }}
            />
          </div>
        </div>
      </section>

      {/* Features - Full-bleed Carousel with blurred edges */}
      <section className="py-16 bg-base-100 w-full px-2 sm:px-4 md:px-8 lg:px-16 xl:px-24 relative text-center">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold">What You Can Do</h2>
        </div>
        <div className="relative w-full">
          {/* Left gradient overlay */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-16 z-10 bg-gradient-to-r from-base-100 to-transparent"></div>
          {/* Right gradient overlay */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-16 z-10 bg-gradient-to-l from-base-100 to-transparent"></div>
          <div className="carousel carousel-center w-full px-4 space-x-6">
            {/* Feature 1 */}
            <div className="carousel-item w-64 md:w-80">
              <div className="card bg-base-200 p-6 shadow-md h-full">
                <h3 className="text-lg font-semibold mb-2">Upload Media</h3>
                <p className="text-gray-300">Seamlessly upload your images and videos to get started instantly.</p>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="carousel-item w-64 md:w-80">
              <div className="card bg-base-200 p-6 shadow-md h-full">
                <h3 className="text-lg font-semibold mb-2">Social Media AI cropping</h3>
                <p className="text-gray-300">Smart AI cropping for perfectly formatted social media posts.</p>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="carousel-item w-64 md:w-80">
              <div className="card bg-base-200 p-6 shadow-md h-full">
                <h3 className="text-lg font-semibold mb-2">Background Removal</h3>
                <p className="text-gray-300">Remove image backgrounds with a single click using advanced AI models.</p>
              </div>
            </div>
            {/* Feature 4 */}
            <div className="carousel-item w-64 md:w-80">
              <div className="card bg-base-200 p-6 shadow-md h-full">
                <h3 className="text-lg font-semibold mb-2">Change Background</h3>
                <p className="text-gray-300">Describe your vision — AI will bring the background to life..</p>
              </div>
            </div>
            {/* Feature 5 */}
            <div className="carousel-item w-64 md:w-80">
              <div className="card bg-base-200 p-6 shadow-md h-full">
                <h3 className="text-lg font-semibold mb-2">Replace Object</h3>
                <p className="text-gray-300">Don&apos;t like an object, want it to be replaced? Watch AI do it.</p>
              </div>
            </div>
            {/* Feature 6 */}
            <div className="carousel-item w-64 md:w-80">
              <div className="card bg-base-200 p-6 shadow-md h-full">
                <h3 className="text-lg font-semibold mb-2">Smart Preview</h3>
                <p className="text-gray-300">Support preview for video uploaded, just for an extra glimpse.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <Link href="https://github.com/Purusharthseth" target="_blank" rel="nofollow noopener noreferrer"
      className="footer p-5 bg-base-300 text-neutral-content mt-auto flex justify-between items-center">
        <aside>
          <span>Aspecto © {new Date().getFullYear()} - All rights reserved</span>
        </aside>
        <div className="flex items-center gap-2">
          <Github />
          <span>Purusharth Seth</span>
        </div>
      </Link>

    </main>
  );
}