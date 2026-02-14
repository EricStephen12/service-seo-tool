import Groq from 'groq-sdk';
import sharp from 'sharp';
import fs from 'fs/promises';
import { SEOIssue } from '../seo-analyzer/technical-seo';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function generateAutoFix(issue: SEOIssue, context: any) {
    switch (issue.fix_action) {
        case 'generate_title':
            return await generateAIData('meta title', context);
        case 'generate_description':
            return await generateAIData('meta description', context);

        // Trust Page Generators
        case 'generate_about_page':
            return await generatePageContent('About Us', context);
        case 'generate_contact_page':
            return await generatePageContent('Contact Us', context);
        case 'generate_privacy_policy':
            return await generatePageContent('Privacy Policy', context);
        case 'generate_terms':
            return await generatePageContent('Terms of Service', context);

        case 'generate_alt_tags':
            return await generateAltTags(context.images);
        case 'compress_images':
            return await compressImages(context.imagePaths);
        case 'generate_expanded_content':
            return await generateAIData('SEO content expansion (add 300+ words of high-value service details)', context);
        case 'create_sitemap':
            return await generateSitemap(context.urls);
        default:
            return null;
    }
}

async function generatePageContent(pageType: string, context: any) {
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: `You are an expert Legal & Content SEO copywriter. Generate a professional, legally-compliant (generic placeholder), and high-trust HTML page body for a ${pageType} page.
                
                You MUST return a JSON object with:
                1. "content": The full HTML body content (excluding <html>/<body> tags, just the inner content with <h1>, <p>, <ul>, etc.). 
                   - For Privacy/Terms: Use standard GDPR/CCPA friendly boilerplate.
                   - For About/Contact: Use persuasive, trust-building copy based on the site context.
                2. "instructions": "Create a new page URL (e.g., /${pageType.toLowerCase().replace(' ', '-')}) and paste this HTML code into the content area."`
            },
            {
                role: "user",
                content: `Website URL: ${context.url}\nContext Snippet: ${context.content.substring(0, 500)}`
            }
        ],
        response_format: { type: "json_object" }
    });

    try {
        const result = JSON.parse(response.choices[0].message.content || '{}');
        return result;
    } catch (e) {
        return { content: "Error generating content. Please try again.", instructions: "Retry generation." };
    }
}

async function generateSchema(context: any) {
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: `You are a Technical SEO expert. Generate a valid JSON-LD Schema.org block for a LocalBusiness or Organization.
                
                CRITICAL - YOU MUST INCLUDE:
                1. "sameAs": [] (Array of social profiles found in context or placeholders) - This is key for the Knowledge Graph.
                2. "areaServed": "City, Country" (Infer from context) - Critical for Local SEO.
                3. "priceRange": "$$" (Default to $$)
                
                You MUST return a JSON object with:
                1. "content": The valid JSON-LD code block (wrapped in <script type="application/ld+json">...</script>).
                2. "instructions": "Paste this code into the <head> or footer of your website. It connects your website to your real-world identity."
                
                Use the provided context to infer: Name, Address, Phone, Description, and URL.`
            },
            {
                role: "user",
                content: `Website URL: ${context.url}\nContext Snippet: ${context.content.substring(0, 1000)}`
            }
        ],
        response_format: { type: "json_object" }
    });

    try {
        const result = JSON.parse(response.choices[0].message.content || '{}');
        return result;
    } catch (e) {
        return { content: "", instructions: "Failed to generate schema." };
    }
}

async function generateAIData(type: string, context: any) {
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: `You are an SEO expert. Generate a highly optimized ${type} for a service business. 
                
                You MUST return a JSON object with the following fields:
                1. "content": The actual text of the fix (e.g. the meta description or title).
                2. "instructions": A simple, one-sentence instruction for a non-technical user on WHERE and HOW to implement this fix in their website builder (WordPress, Wix, custom HTML, etc.).`
            },
            {
                role: "user",
                content: `Website URL: ${context.url}\nContent Snippet: ${context.content.substring(0, 1000)}`
            }
        ],
        response_format: { type: "json_object" }
    });

    try {
        const result = JSON.parse(response.choices[0].message.content || '{}');
        return result;
    } catch (e) {
        return { content: response.choices[0].message.content, instructions: "Apply this fix to your website source code." };
    }
}

async function generateAltTags(images: any[]) {
    // Logic to call Gemini Vision for each image to generate alt text
    // For now, return placeholders or use page context
    return images.map(img => ({
        src: img.src,
        suggested_alt: "Professional service business image"
    }));
}

async function compressImages(paths: string[]) {
    for (const path of paths) {
        try {
            const buffer = await fs.readFile(path);
            await sharp(buffer)
                .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 80 })
                .toFile(path.replace(/\.[^/.]+$/, ".webp"));
        } catch (err) {
            console.error(`Failed to compress ${path}:`, err);
        }
    }
}

async function generateSitemap(urls: string[]) {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('')}
</urlset>`;
    return xml;
}
