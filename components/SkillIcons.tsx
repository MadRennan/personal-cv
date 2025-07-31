import React from 'react';

// A standardized set of icons for each skill.
// Each icon is a React component with a 24x24 viewBox and uses `currentColor` for theme compatibility.

const ReactIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.5">
        <title>React</title>
        <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
        <ellipse cx="12" cy="12" rx="11" ry="4.5" />
        <ellipse cx="12" cy="12" rx="11" ry="4.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="11" ry="4.5" transform="rotate(120 12 12)" />
    </svg>
);

const TypeScriptIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <title>TypeScript</title>
        <path d="M1.5 3h21v18h-21V3zm12.19 13.2h2.3v-3.3h1.8v-2h-1.8v-1.9h-2.3v1.9h-2v2h2v3.3zm-5.69-5.1h2.2v2h-4.5v-2h2.3v-4.5H8.3v-2h4.5v2h-2.3v4.5z"/>
    </svg>
);

const NextjsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <title>Next.js</title>
    <path d="M9.852 4.01h4.296v10.128l5.88-5.874V4.01h4.296V20h-4.296V9.872l-5.88 5.874V20H5.556V4.01h4.296z"/>
  </svg>
);

const TailwindIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <title>Tailwind CSS</title>
    <path d="M12 .5a11.5 11.5 0 1 0 11.5 11.5A11.51 11.51 0 0 0 12 .5zm5.18 8.8-4.32 4.32a.75.75 0 0 1-1.06 0l-4.32-4.32a.75.75 0 0 1 1.06-1.06l3.26 3.25 3.26-3.25a.75.75 0 0 1 1.06 1.06zM7.88 15.3a.75.75 0 0 1 0-1.06l3.26-3.25 3.26 3.25a.75.75 0 0 1-1.06 1.06L12 14.25l-3.06 3.05a.75.75 0 0 1-1.06 0z"/>
  </svg>
);

const NodejsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <title>Node.js</title>
    <path d="M11.51,20.06,4.2,16.21V8.79L11.51,5V3L2,7.5v9L11.51,21ZM12.49,5,19.8,8.79v7.42L12.49,20.06V21L22,16.5v-9L12.49,3Z" />
  </svg>
);

const ExpressIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <title>Express</title>
    <path d="M12.4,14.4l-3.32,3.32H5.16l3.32-3.32-3.32-3.32h3.92l3.32,3.32Zm8.56,2.2V8.24h-4.8V6.6h4.8V5.36h1.48V6.6h2.24V8.24h-2.24v6.8h2.6v1.64h-4.28Z" />
  </svg>
);

const PythonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <title>Python</title>
    <path d="M24 12c0 3.32-2.69 6-6 6a5.86 5.86 0 0 1-4.4-1.93V24h-3.13V5.55A5.86 5.86 0 0 1 18 0c3.31 0 6 2.69 6 6v1.44A4.54 4.54 0 0 1 19.44 6a4.54 4.54 0 0 1 4.5 4.56V12zm-8.87-4.44A1.86 1.86 0 0 0 18 5.7a1.86 1.86 0 0 0-2.87 1.86v2.88A1.86 1.86 0 0 0 18 12.3a1.86 1.86 0 0 0 2.87-1.86V7.56zM0 12c0-3.31 2.69-6 6-6a5.86 5.86 0 0 1 4.4 1.93V0h3.13v18.45A5.86 5.86 0 0 1 6 24c-3.31 0-6-2.69-6-6v-1.44A4.54 4.54 0 0 1 4.56 18a4.54 4.54 0 0 1-4.5-4.56V12zm8.87 4.44A1.86 1.86 0 0 0 6 18.3a1.86 1.86 0 0 0 2.87-1.86v-2.88A1.86 1.86 0 0 0 6 11.7a1.86 1.86 0 0 0-2.87 1.86v2.88z"/>
  </svg>
);

const PostgresqlIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <title>PostgreSQL</title>
    <path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zM6 6.3H4.5v11.4h1.5v-4.5h2.55c3.001 0 5.1-2.001 5.1-4.95C13.65 6.3 12.15 6.3 6 6.3zm0 1.5h2.84c1.92 0 3.21 1.02 3.21 3.45s-1.29 3.45-3.21 3.45H6V7.8zm13.2 0h-3.45v11.4h3.15V15h.3c.63 1.05 1.56 1.65 3 1.65 2.49 0 4.35-1.95 4.35-4.95 0-3-1.86-4.95-4.35-4.95-.96 0-1.77.3-2.43.9V7.8zm-.3 4.56c0-1.8 1.02-2.91 2.73-2.91s2.73 1.11 2.73 2.9c0 1.83-1.02 2.94-2.73 2.94s-2.73-1.11-2.73-2.93z" />
  </svg>
);

const GitIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <title>Git</title>
    <path d="M22.5,9.7L22.5,9.7c-0.2-0.4-0.7-0.6-1.2-0.4l-3.3,1.5c-0.3,0.1-0.5-0.1-0.5-0.4V7c0-2.2-1.8-4-4-4H9.4C7.2,3,5.4,4.8,5.4,7v7.5c0,0.3-0.2,0.5-0.5,0.4l-3.3-1.5c-0.5-0.2-1,0-1.2,0.4l0,0c-0.2,0.4,0,1,0.4,1.2l3.2,1.5c1,0.5,1.6,1.5,1.6,2.6v1.5c0,0.4,0.4,0.8,0.8,0.8h8.3c0.4,0,0.8-0.4,0.8-0.8V19c0-1.1,0.6-2.1,1.6-2.6l3.2-1.5C22.5,10.7,22.7,10.1,22.5,9.7z M17.6,12.5c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S18.7,12.5,17.6,12.5z M6.4,12.5c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S7.5,12.5,6.4,12.5z M12,6.5c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,6.5,12,6.5z"/>
  </svg>
);

const DockerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <title>Docker</title>
    <path d="M22.44 11.23a3.834 3.834 0 0 0-3.21-1.89h-.02a3.834 3.834 0 0 0-3.21 1.89c-.04.09-.07.18-.09.28-.25.84-.25 1.75 0 2.59.02.1.05.19.09.28a3.834 3.834 0 0 0 3.21 1.89h.02a3.834 3.834 0 0 0 3.21-1.89c.04-.09.07-.18.09-.28.25-.84.25-1.75 0-2.59a2.76 2.76 0 0 0-.09-.28M1.56 10.45h2.9v3.08h-2.9zm3.5 0h2.9v3.08H5.06zm3.49 0h2.9v3.08h-2.9zm3.49 0h2.9v3.08h-2.9zM24 10.74a6.37 6.37 0 0 0-6.17-5.04c-3.2 0-5.83 2.27-6.32 5.16-2.5.21-4.31 2.33-4.31 4.88v.02c0 2.71 2.2 4.91 4.91 4.91h.02c.4 0 .79-.06 1.17-.15.83 2.15 2.94 3.67 5.41 3.67 3.31 0 6-2.69 6-6a5.72 5.72 0 0 0-.21-1.52c1.93-.31 3.39-2.01 3.39-3.98"/>
  </svg>
);

const FigmaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <title>Figma</title>
    <path d="M12 0c-3.31 0-6 2.69-6 6v6c0 3.31 2.69 6 6 6s6-2.69 6-6V6c0-3.31-2.69-6-6-6zm0 15c-1.66 0-3-1.34-3-3v-3c0-1.66 1.34-3 3-3s3 1.34 3 3v3c0 1.66-1.34 3-3 3zM6 6C2.69 6 0 8.69 0 12s2.69 6 6 6h3v-3H6c-1.66 0-3-1.34-3-3s1.34-3 3-3h3V6H6zm12-6c-3.31 0-6 2.69-6 6v3h3V6c0-1.66 1.34-3 3-3s3 1.34 3 3v12c0 1.66-1.34 3-3 3s-3-1.34-3-3v-3H9v3c0 3.31 2.69 6 6 6s6-2.69 6-6V6c0-3.31-2.69-6-6-6z"/>
  </svg>
);

const AdobeXDIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <title>Adobe XD</title>
    <path d="M14.51 3.2h4.52c1.17 0 2.12.95 2.12 2.12v13.36c0 1.17-.95 2.12-2.12 2.12h-4.52c-1.17 0-2.12-.95-2.12-2.12V5.32c0-1.17.95-2.12 2.12-2.12zm-9.54 0h4.52c1.17 0 2.12.95 2.12 2.12v4.24L7.37 14.68 9.49 18.8H7.37L2.85 12.4V5.32c0-1.17.95-2.12 2.12-2.12z"/>
  </svg>
);


export const skillIcons: { [key: string]: React.FC<{ className?: string }> } = {
  react: ReactIcon,
  typescript: TypeScriptIcon,
  nextjs: NextjsIcon,
  tailwind: TailwindIcon,
  nodejs: NodejsIcon,
  express: ExpressIcon,
  python: PythonIcon,
  postgresql: PostgresqlIcon,
  git: GitIcon,
  docker: DockerIcon,
  figma: FigmaIcon,
  adobexd: AdobeXDIcon,
};