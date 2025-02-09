import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import aboutContent from '../../content/about.md?raw';

interface Section {
  id: string;
  title: string;
}

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState<string>('');
  const [sections, setSections] = useState<Section[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const headingRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Extract sections from markdown content
  useEffect(() => {
    const headingRegex = /^## (.*$)/gm;
    const matches = [...aboutContent.matchAll(headingRegex)];
    const extractedSections = matches.map((match) => ({
      id: match[1].toLowerCase().replace(/\s+/g, '-'),
      title: match[1]
    }));
    setSections(extractedSections);
    if (extractedSections.length > 0) {
      setActiveSection(extractedSections[0].id);
    }
  }, []);

  useEffect(() => {
    const updateActiveSection = () => {
      let currentSection = '';
      const scrollPosition = window.scrollY + 200; // Add offset for better accuracy

      // Find the current section based on scroll position
      headingRefs.current.forEach((element, id) => {
        const { top } = element.getBoundingClientRect();
        const absoluteTop = top + window.scrollY;
        if (absoluteTop <= scrollPosition) {
          currentSection = id;
        }
      });

      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', updateActiveSection);
    // Initial check
    updateActiveSection();

    return () => window.removeEventListener('scroll', updateActiveSection);
  }, [activeSection]);

  const scrollToSection = (sectionId: string) => {
    const element = headingRefs.current.get(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex gap-8">
      {/* Left Navigation Panel */}
      <div className="hidden lg:block w-64 sticky top-24 h-fit">
        <div className="card-gradient bg-white/80 p-6">
          <h2 className="heading-gradient text-xl font-bold mb-6">目录</h2>
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 group ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-700'
                    : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  activeSection === section.id 
                    ? 'bg-primary-500 scale-125' 
                    : 'bg-gray-300 group-hover:bg-gray-400'
                }`}></span>
                {section.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose max-w-none" ref={contentRef} data-page="about">
            <ReactMarkdown
              components={{
                h2: ({ children, ...props }) => {
                  const sectionId = children?.toString().toLowerCase().replace(/\s+/g, '-');
                  return (
                    <h2
                      {...props}
                      ref={el => {
                        if (el && sectionId) {
                          headingRefs.current.set(sectionId, el);
                        }
                      }}
                      data-section={sectionId}
                      className="scroll-mt-24"
                    >
                      {children}
                    </h2>
                  );
                }
              }}
            >
              {aboutContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}