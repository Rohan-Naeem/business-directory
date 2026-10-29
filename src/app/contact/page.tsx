'use client';

import React, { useState } from 'react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Mail, Phone, MapPin, Send, CheckCircle2, Building2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#F7F9FC] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
              Directory Support
            </span>
            <h1 className="text-3xl font-extrabold text-[#172B45] tracking-tight mt-1 mb-2">
              Get in Touch with Our Team
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
              Have questions regarding listing verification, listing removal requests, or advertising inquiries? We are here to assist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <Mail className="w-5 h-5 text-[#10B981] mb-2" />
              <div className="font-bold text-xs text-slate-900">Email Inquiries</div>
              <p className="text-xs text-slate-500">support@nexusbiz.directory</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <MapPin className="w-5 h-5 text-[#10B981] mb-2" />
              <div className="font-bold text-xs text-slate-900">Coverage Areas</div>
              <p className="text-xs text-slate-500">Pakistan • USA • United Kingdom</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <Building2 className="w-5 h-5 text-[#10B981] mb-2" />
              <div className="font-bold text-xs text-slate-900">Moderation Hours</div>
              <p className="text-xs text-slate-500">Monday - Friday (GMT & PKT)</p>
            </div>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-50 rounded-2xl text-center space-y-2 border border-emerald-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-base text-slate-900">Message Received</h3>
              <p className="text-xs text-slate-600">
                Thank you for contacting Global Bizz Hub. An editorial representative will respond to your inquiry shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tariq Khan"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Inquiry regarding my business verification"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message Details
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry or correction in detail..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#065F46] hover:bg-[#044E39] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Inquiry</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
