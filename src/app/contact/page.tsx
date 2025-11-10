'use client';

import { useState, FormEvent } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl font-light text-black mb-4">
            Get in touch
          </h1>
          <p className="text-lg text-gray-500">
            We'd like to hear from you. Send us a message.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Left - Info */}
          <div className="space-y-12">
            <div>
              <p className="text-gray-400 text-sm mb-2">EMAIL</p>
              <p className="text-black">hello@example.com</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-2">PHONE</p>
              <p className="text-black">+1 (555) 123-4567</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-2">ADDRESS</p>
              <p className="text-black">123 Main Street<br />City, State 12345</p>
            </div>
          </div>

          {/* Right - Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-0 py-2 bg-transparent border-b border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:border-black transition text-sm"
                  placeholder="Name"
                />
              </div>

              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-0 py-2 bg-transparent border-b border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:border-black transition text-sm"
                  placeholder="Email"
                />
              </div>

              <div>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-0 py-2 bg-transparent border-b border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:border-black transition text-sm"
                  placeholder="Subject"
                />
              </div>

              <div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-0 py-2 bg-transparent border-b border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:border-black transition resize-none text-sm"
                  placeholder="Message"
                />
              </div>

              {submitStatus === 'success' && (
                <p className="text-sm text-gray-600">Message sent successfully.</p>
              )}

              {submitStatus === 'error' && (
                <p className="text-sm text-gray-600">Failed to send. Try again.</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="text-sm font-light text-black hover:text-gray-600 disabled:text-gray-400 transition"
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}