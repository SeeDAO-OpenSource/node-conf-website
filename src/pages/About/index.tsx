import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';

interface NavItem {
  id: string;
  title: string;
  file: string;
}

const navItems: NavItem[] = [
  { id: 'overview', title: '节点共识大会概述', file: 'overview.md' },
  { id: 'history', title: '历史渊源', file: 'history.md' },
  { id: 'process', title: '会议流程', file: 'process.md' },
  { id: 'rules', title: '参与规则', file: 'rules.md' },
  { id: 'participation', title: '如何参与', file: 'participation.md' },
  { id: 'faq', title: '常见问题', file: 'faq.md' },
  { id: 'metarule', title: '元规则', file: 'metarule.md' },
  { id: 'noderules', title: '节点共识大会规则', file: 'noderules.md' }
];

export default function AboutPage() {
  const { sectionId = 'overview' } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    const loadContent = async () => {
      try {
        const selectedItem = navItems.find(item => item.id === sectionId);
        if (!selectedItem) {
          navigate('/about/overview');
          return;
        }

        let content = '';
        switch (selectedItem.id) {
          case 'overview':
            content = (await import('../../content/about/overview.md?raw')).default;
            break;
          case 'history':
            content = (await import('../../content/about/history.md?raw')).default;
            break;
          case 'process':
            content = (await import('../../content/about/process.md?raw')).default;
            break;
          case 'rules':
            content = (await import('../../content/about/rules.md?raw')).default;
            break;
          case 'participation':
            content = (await import('../../content/about/participation.md?raw')).default;
            break;
          case 'faq':
            content = (await import('../../content/about/faq.md?raw')).default;
            break;
          case 'metarule':
            content = (await import('../../content/about/metarule.md?raw')).default;
            break;
          case 'noderules':
            content = (await import('../../content/about/noderules.md?raw')).default;
            break;
          default:
            content = '# Error\nSection not found.';
        }
        setContent(content);
      } catch (error) {
        console.error('Error loading content:', error);
        setContent('# Error\nFailed to load content.');
      }
    };
    loadContent();
  }, [sectionId, navigate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="hidden lg:block lg:col-span-3">
          <nav className="sticky top-4 space-y-2" aria-label="Sidebar">
            {navItems.map((item) => (
              <a
                key={item.id}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/about/${item.id}`);
                }}
                href={`/about/${item.id}`}
                className={clsx(
                  'block px-3 py-2 text-sm font-medium rounded-md cursor-pointer',
                  sectionId === item.id
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
                aria-current={sectionId === item.id ? 'page' : undefined}
              >
                {item.title}
              </a>
            ))}
          </nav>
        </div>
        <main className="lg:col-span-9">
          <div className="prose prose-lg prose-indigo mx-auto text-gray-500">
            <ReactMarkdown
              components={{
                img: ({node, ...props}) => {
                  const src = props.src?.startsWith('./') 
                    ? `/node-conf-website/images/about/${props.src.slice(2)}` 
                    : `/node-conf-website/images/about/${props.src}`;
                  return <img {...props} src={src} />;
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </main>
      </div>
    </div>
  );
}