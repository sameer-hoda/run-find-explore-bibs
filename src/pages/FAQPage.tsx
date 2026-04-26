import React, { useState } from 'react';
import faqData from '@/ama.json';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface Question {
  question: string;
  answer: string;
}

interface Subcategory {
  subcategory: string;
  questions: Question[];
}

interface Category {
  category: string;
  subcategories: Subcategory[];
}

const FAQPage: React.FC = () => {
  const { faqTitle, description, categories } = faqData;
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryName: string) => {
    setOpenCategory(prevOpenCategory => 
      prevOpenCategory === categoryName ? null : categoryName
    );
  };

  const generateFaqSchema = () => {
    const allQuestions = categories.flatMap(cat => cat.subcategories.flatMap(sub => sub.questions));
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": allQuestions.map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.answer.replace(/\n/g, '<br/>')
        }
      }))
    };
    return JSON.stringify(schema);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Helmet>
        <title>{`${faqTitle} | mynextbib.com`}</title>
        <meta name="description" content={description} />
        <script type="application/ld+json">{generateFaqSchema()}</script>
      </Helmet>
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">{faqTitle}</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">{description}</p>
        </div>

        <div className="space-y-6">
          {categories.map((category: Category) => (
            <Card 
              key={category.category} 
              className="overflow-hidden rounded-xl shadow-md border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 ease-in-out"
            >
              <CardHeader 
                className="cursor-pointer p-5 md:p-6 bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={() => handleCategoryClick(category.category)}
              >
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl md:text-2xl font-semibold text-gray-800">
                    {category.category}
                  </CardTitle>
                  <ChevronDown 
                    className={`h-6 w-6 text-gray-800 transition-transform duration-300 ${
                      openCategory === category.category ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </CardHeader>
              
              <div 
                className={`transition-all duration-500 ease-in-out overflow-hidden ${ 
                  openCategory === category.category ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0' 
                }`}
                style={{ transitionProperty: 'max-height, opacity' }}
              >
                <CardContent className="p-5 md:p-6">
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {category.subcategories.map((subcat: Subcategory) => (
                      <AccordionItem 
                        key={subcat.subcategory} 
                        value={subcat.subcategory} 
                        className="border border-gray-200 rounded-lg bg-white/90 shadow-sm"
                      >
                        <AccordionTrigger className="px-4 py-3 text-lg font-medium text-gray-700 hover:no-underline hover:bg-gray-100 rounded-t-lg">
                          {subcat.subcategory}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-2 pb-4 space-y-3">
                          <Accordion type="single" collapsible className="w-full space-y-2">
                            {subcat.questions.map((q: Question) => (
                              <AccordionItem 
                                key={q.question} 
                                value={q.question} 
                                className="border border-gray-200 rounded-md bg-white"
                              >
                                <AccordionTrigger className="px-3 py-2 text-base text-left hover:no-underline hover:bg-gray-50 rounded-t-md">
                                  {q.question}
                                </AccordionTrigger>
                                <AccordionContent className="px-3 pt-1 pb-3 text-muted-foreground text-sm leading-relaxed">
                                  {q.answer.split('\n').map((paragraph, pIndex) => (
                                    <p key={pIndex} className="mb-2 last:mb-0">{paragraph}</p>
                                  ))}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQPage;