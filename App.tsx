import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

// Data for the habits - makes it easier to manage and map
const habits = [
  {
    icon: '⏱️',
    title: '1. قاعدة الدقيقتين',
    description: 'أي مهمة تستغرق أقل من دقيقتين، أنجزها فورًا.',
    why: 'تقضي على التسويف وتحرر عقلك للمهام الكبرى.'
  },
  {
    icon: '✅',
    title: '2. أولويات اليوم الثلاث',
    description: 'ركّز على أهم 3 مهام فقط.',
    why: 'تمنحك شعورًا بالإنجاز وتضمن تقدمك نحو أهدافك الحقيقية.'
  },
  {
    icon: '🧘',
    title: '3. التنفس العميق للتركيز',
    description: '3 دقائق من التنفس الهادئ قبل بدء العمل.',
    why: 'تقلل التوتر، تزيد الأكسجين في الدماغ، وتعزز تركيزك.'
  },
  {
    icon: '🎯',
    title: '4. مبدأ 80/20 (باريتو)',
    description: '20% من مجهودك يحقق 80% من نتائجك.',
    why: 'يساعدك على تحديد الأنشطة الأكثر تأثيرًا والتركيز عليها.'
  },
  {
    icon: '📵',
    title: '5. التباعد الرقمي',
    description: 'خصص 30 دقيقة يوميًا بلا هاتف أو إشعارات.',
    why: 'يمنح عقلك استراحة ضرورية ويستعيد قدرته على التركيز بعمق.'
  },
  {
    icon: '✍️',
    title: '6. الكتابة الصباحية',
    description: 'صفحتان صباحًا لتفريغ ذهنك وترتيب أفكارك.',
    why: 'تمنحك وضوحًا وصفاءً ذهنيًا لبدء اليوم بقوة.'
  },
  {
    icon: '🚶',
    title: '7. التحرك كل ساعة',
    description: 'دقيقة مشي أو تمطيط تُنعش الدماغ.',
    why: 'تعيد تنشيط الدورة الدموية وتحارب خمول الجلوس الطويل.'
  },
  {
    icon: '🌙',
    title: '8. قاعدة النوم الذهبي',
    description: '7 ساعات من النوم على الأقل هي وقودك الأول.',
    why: 'النوم الجيد ضروري للتركيز، الذاكرة، واتخاذ القرارات السليمة.'
  },
  {
    icon: '🍅',
    title: '9. جلسات التركيز (بومودورو)',
    description: '25 دقيقة عمل مركز + 5 دقائق استراحة.',
    why: 'تجعل المهام أسهل وتمنع الإرهاق الذهني.'
  },
  {
    icon: '📝',
    title: '10. المراجعة المسائية',
    description: 'دقيقتان لتدوين إنجازاتك والتخطيط للغد.',
    why: 'تمنحك شعورًا بالرضا وتجعلك تبدأ يومك التالي بهدف واضح.'
  }
];

const testimonials = [
  {
    quote: "تطبيق عادة واحدة فقط (قاعدة الدقيقتين) غيّرت طريقة تعاملي مع المهام الصغيرة. أشعر بسيطرة أكبر على يومي.",
    author: "سارة. م"
  },
  {
    quote: "كنت أعتقد أنني مشغول، لكني اكتشفت أنني غير مُنتج. مبدأ 80/20 فتح عيني على ما يهم حقًا.",
    author: "أحمد. ق"
  },
  {
    quote: "الكتابة الصباحية كانت أفضل إضافة لروتيني. أبدأ يومي بصفاء ذهني وتركيز لم أعهده من قبل.",
    author: "فاطمة. ع"
  }
];


// Main App Component
const App = () => {
  const [email, setEmail] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Refs for scroll animations
  const headerRef = useRef<HTMLElement>(null);
  const painPointRef = useRef(null);
  const solutionRef = useRef(null);
  const bookCtaRef = useRef(null);
  const habitsRef = useRef(null);
  const socialProofRef = useRef(null);
  const finalCtaRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Animate only once
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    const sections = [painPointRef, solutionRef, bookCtaRef, habitsRef, socialProofRef, finalCtaRef];
    sections.forEach(sectionRef => {
      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }
    });

    return () => {
       sections.forEach(sectionRef => {
         if (sectionRef.current) {
           // eslint-disable-next-line react-hooks/exhaustive-deps
           observer.unobserve(sectionRef.current);
         }
       });
    };
  }, []);

  // Testimonial Carousel Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(prevIndex => (prevIndex + 1) % testimonials.length);
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(timer); // Cleanup on component unmount
  }, []);

  const handlePrevTestimonial = () => {
    setActiveTestimonial(prevIndex => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const handleNextTestimonial = () => {
    setActiveTestimonial(prevIndex => (prevIndex + 1) % testimonials.length);
  };

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute('href')?.substring(1);
    const targetElement = targetId ? document.getElementById(targetId) : null;

    if (targetElement) {
        const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        
        window.scrollTo({
            top: targetPosition - headerHeight,
            behavior: 'smooth'
        });
    }
    // For mobile, close the menu after clicking a link
    if (isMenuOpen) {
        setIsMenuOpen(false);
    }
  };


  return (
    <div className="bg-gray-50 text-gray-800 font-sans">
       {/* Header & Navigation */}
      <nav ref={headerRef} className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#" className="text-3xl font-black text-blue-700">إنتاجيتي</a>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-x-8">
              <a href="#habits" onClick={handleNavClick} className="text-gray-700 hover:text-blue-700 transition font-medium">العادات</a>
              <a href="#reviews" onClick={handleNavClick} className="text-gray-700 hover:text-blue-700 transition font-medium">الآراء</a>
              <a href="#subscribe" onClick={handleNavClick} className="text-gray-700 hover:text-blue-700 transition font-medium">اشترك</a>
            </div>

            {/* CTA & Mobile Burger */}
            <div className="flex items-center gap-x-4">
              <a href="https://heydesignstore.gumroad.com/l/ThePowerofHabitsThehiddensecretofdailyproductivity" target="_blank" rel="noopener noreferrer" className="hidden md:inline-block bg-yellow-400 hover:bg-yellow-500 text-blue-800 font-bold py-2 px-6 rounded-lg transition duration-300">
                اشتري الآن
              </a>
              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
                  <svg className="w-8 h-8 text-gray-700" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    {isMenuOpen ? (
                      <path d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        <div className={`transition-all duration-300 ease-in-out md:hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden bg-white absolute w-full shadow-lg`}>
          <a href="#habits" onClick={handleNavClick} className="block text-center py-4 px-6 text-lg text-gray-700 hover:bg-gray-100">العادات</a>
          <a href="#reviews" onClick={handleNavClick} className="block text-center py-4 px-6 text-lg text-gray-700 hover:bg-gray-100">الآراء</a>
          <a href="#subscribe" onClick={handleNavClick} className="block text-center py-4 px-6 text-lg text-gray-700 hover:bg-gray-100">اشترك</a>
          <div className="p-4">
             <a href="https://heydesignstore.gumroad.com/l/ThePowerofHabitsThehiddensecretofdailyproductivity" target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-yellow-400 hover:bg-yellow-500 text-blue-800 font-bold py-3 px-6 rounded-lg transition duration-300">
                اشتري الآن
             </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-cover bg-center text-white py-24 px-6" style={{backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2072&auto=format&fit=crop')"}}>
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight opacity-0 animate-fadeInUp">غيّر يومك... وضاعف إنتاجيتك</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 opacity-0 animate-fadeInUp animation-delay-300">
            اكتشف 10 عادات صغيرة وسهلة التطبيق أثبتت فعاليتها في زيادة التركيز، تقليل المشتتات، وإنجاز المزيد من المهام الهامة كل يوم.
          </p>
          <div className="mt-12">
            <a 
              href="https://heydesignstore.gumroad.com/l/ThePowerofHabitsThehiddensecretofdailyproductivity"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-blue-800 font-bold text-2xl py-4 px-10 rounded-lg transition duration-300 shadow-lg whitespace-nowrap"
            >
              اشتري الكتاب الآن
            </a>
            <p className="text-white text-sm mt-2 opacity-80">نسخة رقمية + كتاب صوتي</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Pain Point Section */}
        <section ref={painPointRef} className="py-20 px-6 text-center fade-in-section">
          <div className="container mx-auto">
            <div className="text-6xl mb-4" role="img" aria-label="Tired face">😩</div>
            <h2 className="text-4xl font-bold my-4">هل تشعر أن يومك ينتهي قبل مهامك؟</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8 text-gray-600">
              في عالم مليء بالإشعارات والمقاطعات، أصبح الحفاظ على التركيز تحديًا حقيقيًا. قد تشعر أحيانًا:
            </p>
            <ul className="list-none space-y-2 text-lg text-gray-700 max-w-md mx-auto bg-gray-100 p-6 rounded-lg">
              <li>بالفوضى من كثرة المهام المطلوبة منك.</li>
              <li>بالإرهاق من محاولة التوفيق بين كل شيء.</li>
              <li>بخيبة الأمل في نهاية اليوم لأنك لم تنجز ما خططت له.</li>
            </ul>
            <p className="text-xl max-w-2xl mx-auto mt-8 font-semibold text-blue-600">
              الحل ليس في العمل لساعات أطول، بل في العمل بذكاء أكبر.
            </p>
          </div>
        </section>

        {/* The Solution Section */}
        <section ref={solutionRef} className="py-20 px-6 text-center bg-gray-100 fade-in-section">
          <div className="container mx-auto">
            <div className="text-6xl mb-4" role="img" aria-label="Light bulb">💡</div>
            <h2 className="text-4xl font-bold my-4">الإنتاجية تبدأ بخطوات صغيرة ومتسقة</h2>
            <p className="text-lg max-w-3xl mx-auto text-gray-600">
              نقدم لك 10 عادات بسيطة، كل واحدة منها مصممة لتُحدث فرقًا فوريًا في يومك. لا حاجة لخطط معقدة أو تغييرات جذرية. جربها وستلاحظ الفرق بنفسك.
            </p>
          </div>
        </section>

        {/* Habits Section */}
        <section ref={habitsRef} id="habits" className="py-20 px-6 bg-gray-50 fade-in-section">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {habits.map((habit, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-start gap-4">
                  <div className="text-4xl mt-1">{habit.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{habit.title}</h3>
                    <p className="text-gray-700 mb-4">{habit.description}</p>
                    <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded-md"><strong className="text-gray-800">لماذا؟</strong> {habit.why}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Book CTA Section */}
        <section ref={bookCtaRef} className="py-20 px-6 bg-white fade-in-section">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/3 flex justify-center">
                        <img src="https://placehold.co/400x600/e2e8f0/334155?text=غلاف+الكتاب" alt="غلاف الكتاب" className="rounded-lg shadow-2xl max-w-xs w-full" />
                    </div>
                    <div className="md:w-2/3 text-center md:text-right">
                        <h2 className="text-4xl font-bold mb-4">دليلك العملي لحياة أكثر إنجازًا</h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            هذا الكتاب ليس مجرد قائمة من النصائح، بل هو نظام متكامل يأخذ بيدك خطوة بخطوة لتحويل هذه العادات إلى جزء لا يتجزأ من روتينك اليومي. اكتشف استراتيجيات عملية للتغلب على التسويف، تنظيم وقتك بفعالية، وتحقيق أهدافك الكبرى دون الشعور بالضغط أو الإرهاق.
                        </p>
                        <a href="https://heydesignstore.gumroad.com/l/ThePowerofHabitsThehiddensecretofdailyproductivity" target="_blank" rel="noopener noreferrer" className="inline-block bg-yellow-400 hover:bg-yellow-500 text-blue-800 font-bold text-2xl py-4 px-10 rounded-lg transition duration-300 shadow-lg">
                            اشتري الكتاب الآن
                        </a>
                    </div>
                </div>
            </div>
        </section>
        
        {/* Social Proof Section - Carousel */}
        <section ref={socialProofRef} id="reviews" className="py-20 px-6 bg-gray-100 fade-in-section">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-bold mb-12">ماذا يقول المستخدمون؟</h2>
                <div className="relative max-w-2xl mx-auto">
                    {/* Testimonials */}
                    <div className="overflow-hidden relative h-48 md:h-36">
                        {testimonials.map((testimonial, index) => (
                             <div 
                                key={index} 
                                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${activeTestimonial === index ? 'opacity-100' : 'opacity-0'}`}
                             >
                                <blockquote className="bg-white p-8 rounded-lg shadow-lg h-full flex flex-col justify-center">
                                    <p className="text-gray-600 italic mb-4 text-lg">"{testimonial.quote}"</p>
                                    <footer className="font-bold text-gray-800">– {testimonial.author}</footer>
                                </blockquote>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button onClick={handlePrevTestimonial} className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-16 bg-white/50 hover:bg-white rounded-full p-2 transition" aria-label="Previous testimonial">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button onClick={handleNextTestimonial} className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-16 bg-white/50 hover:bg-white rounded-full p-2 transition" aria-label="Next testimonial">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Indicator Dots */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTestimonial(index)}
                                className={`w-3 h-3 rounded-full transition-colors ${activeTestimonial === index ? 'bg-blue-700' : 'bg-gray-300 hover:bg-gray-400'}`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* Final CTA Section */}
        <section ref={finalCtaRef} id="subscribe" className="py-24 px-6 bg-blue-700 text-white text-center fade-in-section">
            <div className="container mx-auto">
                <h2 className="text-4xl md:text-5xl font-black mb-4">مستعد لتبدأ؟</h2>
                <p className="text-xl max-w-3xl mx-auto mb-6 opacity-90">
                    خطوتك الأولى بسيطة جدًا. لا تحتاج لتطبيق كل هذه العادات دفعة واحدة. ابدأ بعادة واحدة فقط هذا الأسبوع. ستتفاجأ كيف أن خطوة صغيرة قادرة على إحداث فرق هائل.
                </p>
                 <p className="text-xl font-bold max-w-3xl mx-auto mb-8">
                    هل تريد المزيد من الأدوات العملية لمساعدتك؟
                 </p>
                 <p className="text-lg max-w-3xl mx-auto mb-8 opacity-90">
                   اشترك في نشرتنا البريدية الأسبوعية واحصل على أدوات حصرية، أوراق عمل، ونصائح متقدمة لبناء نظام إنتاجية متكامل يناسب أسلوب حياتك.
                 </p>
                <div className="max-w-2xl mx-auto">
                    <form className="flex flex-col sm:flex-row gap-4 justify-center" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="أدخل بريدك الإلكتروني لتنضم إلينا"
                            className="w-full sm:w-auto flex-grow p-4 text-lg text-gray-800 border-2 border-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                            aria-label="البريد الإلكتروني"
                        />
                        <button type="submit" className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-blue-800 font-bold text-lg py-4 px-8 rounded-lg transition duration-300 whitespace-nowrap">
                           نعم، أريد زيادة إنتاجيتي!
                        </button>
                    </form>
                </div>
            </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-6 text-center">
        <div className="container mx-auto">
          <div className="flex justify-center gap-6 mb-6">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                   <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </a>
          </div>
          <p>© 2025 Ahmed AE. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;