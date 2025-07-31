
import React, { useState, useMemo, FormEvent } from 'react';
import Section from './Section';
import { useLanguage } from '../hooks/useLanguage';

const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const Contact: React.FC = () => {
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isFormValid = useMemo(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return name.trim() !== '' && emailRegex.test(email) && message.trim() !== '';
    }, [name, email, message]);

    const handleFormSubmit = (e: FormEvent) => {
        if (isFormValid) {
            setIsSubmitting(true);
        }
    };
    
    return (
        <Section id="contact" title={t('contact.title')} className="text-center">
            <div className="max-w-2xl mx-auto">
                <p className="text-lg text-neutral-600 dark:text-neutral-300 -mt-8 mb-12">
                  {t('contact.description')}
                </p>
                <form
                    action="https://formsubmit.co/rennanliradf03@gmail.com"
                    method="POST"
                    onSubmit={handleFormSubmit}
                    className="space-y-6"
                >
                    <input type="hidden" name="_subject" value="New Submission from your Portfolio!" />
                    <input type="hidden" name="_autoresponse" value="Thank you for your message! I will get back to you shortly." />

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="floating-label-group">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="floating-label-input"
                                placeholder=" "
                                required
                                disabled={isSubmitting}
                            />
                            <label htmlFor="name" className="floating-label">{t('contact.form.name')}</label>
                        </div>
                        <div className="floating-label-group">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="floating-label-input"
                                placeholder=" "
                                required
                                disabled={isSubmitting}
                            />
                            <label htmlFor="email" className="floating-label">{t('contact.form.email')}</label>
                        </div>
                    </div>
                    <div className="floating-label-group">
                        <textarea
                            id="message"
                            name="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="floating-label-input min-h-[150px]"
                            rows={5}
                            placeholder=" "
                            required
                            disabled={isSubmitting}
                        />
                        <label htmlFor="message" className="floating-label">{t('contact.form.message')}</label>
                    </div>
                    
                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={!isFormValid || isSubmitting}
                            className="btn-primary-gradient w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-neutral-950 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary-600/30 dark:hover:shadow-primary-400/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                        >
                            {isSubmitting ? (
                                <>
                                    <SpinnerIcon className="w-6 h-6 mr-3 animate-spin" />
                                    {t('contact.form.submitting')}
                                </>
                            ) : (
                                t('contact.form.submit')
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Section>
    );
};

export default Contact;
