"use client";

import { Calendar, Image as ImageIcon, MessageSquare, Megaphone, MapPin, Send } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="pt-8 pb-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-brand-dark dark:text-white mb-6">Your Community Belongs on LGN.</h1>
          <p className="text-xl text-brand-dark/70 dark:text-white/70">
            Submit stories, events, public notices, achievements, and issues that matter to your community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-7">
            <div className="glass-card p-6 md:p-10">
              <h2 className="text-2xl font-bold mb-8 text-brand-dark dark:text-white">Submit to LGN</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-brand-dark/80 dark:text-white/80">Full Name</label>
                    <input type="text" className="w-full bg-transparent border border-brand-purple/20 dark:border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-pink transition-colors" placeholder="e.g. John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-brand-dark/80 dark:text-white/80">Email Address</label>
                    <input type="email" className="w-full bg-transparent border border-brand-purple/20 dark:border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-pink transition-colors" placeholder="e.g. john@example.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-brand-dark/80 dark:text-white/80">Phone Number</label>
                    <input type="tel" className="w-full bg-transparent border border-brand-purple/20 dark:border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-pink transition-colors" placeholder="e.g. 868-555-0199" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-brand-dark/80 dark:text-white/80">Community / Area</label>
                    <input type="text" className="w-full bg-transparent border border-brand-purple/20 dark:border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-pink transition-colors" placeholder="e.g. Marabella" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-brand-dark/80 dark:text-white/80">Submission Type</label>
                  <select defaultValue="" className="w-full bg-transparent border border-brand-purple/20 dark:border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-pink transition-colors appearance-none">
                    <option value="" disabled>Select an option...</option>
                    <option value="news">Submit News Tip</option>
                    <option value="event">Submit Event</option>
                    <option value="shoutout">Birthday Shoutout</option>
                    <option value="announcement">Community Announcement</option>
                    <option value="coverage">Request Coverage</option>
                    <option value="church">Church / Nonprofit Notice</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-brand-dark/80 dark:text-white/80">Message / Details</label>
                  <textarea rows={5} className="w-full bg-transparent border border-brand-purple/20 dark:border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-pink transition-colors" placeholder="Provide all the necessary details here..."></textarea>
                </div>

                <div className="space-y-2 border-2 border-dashed border-brand-purple/20 dark:border-white/20 rounded-xl p-8 text-center hover:bg-brand-purple/5 transition-colors cursor-pointer">
                  <ImageIcon className="w-8 h-8 mx-auto mb-3 text-brand-pink" />
                  <p className="font-semibold text-brand-dark dark:text-white">Click to upload photos or videos</p>
                  <p className="text-sm text-brand-dark/50 dark:text-white/50 mt-1">MP4, JPG, PNG up to 50MB</p>
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="consent" className="mt-1.5 w-4 h-4 text-brand-pink focus:ring-brand-pink rounded border-gray-300" />
                  <label htmlFor="consent" className="text-sm text-brand-dark/70 dark:text-white/70 leading-relaxed">
                    I consent to LGN reviewing and potentially broadcasting or publishing this submission across television, web, and mobile app platforms. I confirm I have the right to share this media.
                  </label>
                </div>

                <button type="button" onClick={(e) => e.preventDefault()} className="w-full bg-brand-pink text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-pink/90 transition-colors shadow-xl shadow-brand-pink/20">
                  <Send className="w-5 h-5" />
                  Submit to LGN
                </button>
              </form>
            </div>
          </div>

          {/* Guidelines Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-8 bg-brand-purple text-white">
              <h3 className="text-xl font-bold mb-6">What can I submit?</h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="bg-white/10 p-3 rounded-lg shrink-0 h-fit">
                    <MessageSquare className="w-6 h-6 text-brand-pink" />
                  </div>
                  <div>
                    <h4 className="font-bold">News Tips & Story Ideas</h4>
                    <p className="text-white/70 text-sm mt-1">Something happening in your neighborhood? Let our news desk know.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-white/10 p-3 rounded-lg shrink-0 h-fit">
                    <Calendar className="w-6 h-6 text-brand-pink" />
                  </div>
                  <div>
                    <h4 className="font-bold">Events & Gatherings</h4>
                    <p className="text-white/70 text-sm mt-1">Submit cultural events, markets, concerts, or school functions to our calendar.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-white/10 p-3 rounded-lg shrink-0 h-fit">
                    <Megaphone className="w-6 h-6 text-brand-pink" />
                  </div>
                  <div>
                    <h4 className="font-bold">Public & Community Notices</h4>
                    <p className="text-white/70 text-sm mt-1">Share church activities, non-profit initiatives, or local organization updates.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-white/10 p-3 rounded-lg shrink-0 h-fit">
                    <MapPin className="w-6 h-6 text-brand-pink" />
                  </div>
                  <div>
                    <h4 className="font-bold">Request Coverage</h4>
                    <p className="text-white/70 text-sm mt-1">Invite our camera crews to cover significant milestones in your community.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="glass-card p-8 bg-brand-dark text-white border-t-4 border-brand-pink">
              <h3 className="font-bold mb-2">Need to contact the Newsroom directly?</h3>
              <p className="text-white/70 text-sm mb-4">For urgent breaking news or sensitive information.</p>
              <a href="tel:+18685550199" className="text-brand-pink font-bold hover:underline">Call: +1 868 555 0199</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
