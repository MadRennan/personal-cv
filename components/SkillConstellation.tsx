
import React, { useRef, useEffect, useMemo, useCallback, memo, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { useSkillSelection } from '../hooks/useSkillSelection';
import { Skill, Point } from '../types';

// Utility function to calculate distance between two points
const dist = (p1: Point, p2: Point) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

// Utility function to wrap text for tooltips
const wrapText = (context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    let lines: string[] = [];
    if (words.length === 0) return [];
    
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = context.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

// Icon for the mobile dialog close button
const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface SkillConstellationProps {
  focusedCategory: string | null;
  setFocusedCategory: (category: string | null) => void;
}

const SkillConstellation: React.FC<SkillConstellationProps> = memo(({ focusedCategory, setFocusedCategory }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { t } = useLanguage();
    const { theme } = useTheme();
    const { selectSkill } = useSkillSelection();
    const skills: Skill[] = t('skills.items');
    
    const [focusedNode, setFocusedNode] = useState<any | null>(null);
    const [isDialogClosing, setIsDialogClosing] = useState(false);
    const isWideRef = useRef(true);

    const nodesRef = useRef<any[]>([]);
    const animationFrameId = useRef<number | null>(null);
    const mousePos = useRef<Point | null>(null);
    const hoveredNodeRef = useRef<any | null>(null);
    const globalRotation = useRef(0);
    const transform = useRef({
        scale: 1, targetScale: 1,
        x: 0, targetX: 0,
        y: 0, targetY: 0,
    });
    
    const focusedCategoryRef = useRef(focusedCategory);
    const focusedNodeRef = useRef(focusedNode);

    useEffect(() => {
      focusedCategoryRef.current = focusedCategory;
      if (focusedCategory === null) {
        setFocusedNode(null);
      }
    }, [focusedCategory]);

    useEffect(() => {
        focusedNodeRef.current = focusedNode;
    }, [focusedNode]);

    const categoryColors = useMemo(() => ({
        light: {
            Frontend: '#4f46e5', Backend: '#059669', Tools: '#475569', Design: '#e11d48', 'Soft Skills': '#d97706', 'Sciences': '#0d9488',
            line: '#d4d4d8', tooltipBg: '#18181b', tooltipText: '#fafafa',
        },
        dark: {
            Frontend: '#818cf8', Backend: '#34d399', Tools: '#94a3b8', Design: '#fb7185', 'Soft Skills': '#fbbf24', 'Sciences': '#2dd4bf',
            line: '#3f3f46', tooltipBg: '#fafafa', tooltipText: '#18181b',
        },
    }), []);
    
    const initializeNodes = useCallback((width: number, height: number) => {
        const uniqueCategories = [...new Set(skills.map(s => s.category))].sort((a, b) => {
            const order = ['Frontend', 'Backend', 'Tools', 'Design', 'Soft Skills', 'Sciences'];
            return order.indexOf(a) - order.indexOf(b);
        });
        const centers: { [key: string]: Point } = {};
        const isWide = isWideRef.current;
    
        if (isWide) {
            const radiusMultiplier = 0.35;
            uniqueCategories.forEach((key, index) => {
                const angle = (-Math.PI / 2) + (index / uniqueCategories.length) * Math.PI * 2;
                centers[key] = {
                    x: Math.cos(angle) * radiusMultiplier + 0.5,
                    y: Math.sin(angle) * radiusMultiplier + 0.5,
                };
            });
        } else {
            const columns = 2;
            const rows = Math.ceil(uniqueCategories.length / columns);
            const x_padding = 0.25; const y_padding = 0.15;
            const col_width = 1 - x_padding * 2; const row_height = 1 - y_padding * 2;
    
            uniqueCategories.forEach((key, index) => {
                const col = index % columns;
                const row = Math.floor(index / columns);
                centers[key] = {
                    x: x_padding + col * col_width,
                    y: y_padding + (rows > 1 ? (row / (rows - 1)) * row_height : row_height / 2),
                };
            });
        }

        const baseRadius = isWide ? 6 : 4; // Smaller base radius for mobile

        nodesRef.current = skills.map((skill) => {
            const categoryCenter = centers[skill.category];
            if (!categoryCenter) return null;
            const homeX = categoryCenter.x * width + (Math.random() - 0.5) * 50;
            const homeY = categoryCenter.y * height + (Math.random() - 0.5) * 50;
            
            return { 
                skill, x: homeX, y: homeY, vx: 0, vy: 0, 
                radius: baseRadius, targetRadius: baseRadius, opacity: 1, targetOpacity: 1, 
                homeX, homeY,
                z: Math.random() * 0.4 + 0.6, // Depth for parallax
                animOffset: Math.random() * Math.PI * 2 // Animation offset for twinkling
            };
        }).filter(Boolean);
    }, [skills]);
    
    const handleCloseDialog = useCallback(() => {
        setIsDialogClosing(true);
        setTimeout(() => {
            setFocusedNode(null);
            setFocusedCategory(null);
            setIsDialogClosing(false);
        }, 300);
    }, [setFocusedCategory]);

    const handleFilterProjects = useCallback((skill: Skill) => {
        selectSkill(skill);
        handleCloseDialog();
        setTimeout(() => {
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }, [selectSkill, handleCloseDialog]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.offsetWidth;
        let height = canvas.offsetHeight;
        
        const handleResize = () => {
            const dpr = window.devicePixelRatio || 1;
            width = canvas.offsetWidth; height = canvas.offsetHeight;
            
            isWideRef.current = window.innerWidth >= 768;
            
            canvas.width = width * dpr; canvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            initializeNodes(width, height);
        };
        handleResize();

        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mousePos.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
        };
        const handleMouseLeave = () => { mousePos.current = null; hoveredNodeRef.current = null; };
        
        const handleClick = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const clickPos = { x: event.clientX - rect.left, y: event.clientY - rect.top };
            const worldClickPos = {
                x: (clickPos.x - transform.current.x) / transform.current.scale,
                y: (clickPos.y - transform.current.y) / transform.current.scale
            };

            let clickedNode: any | null = null;
            const sortedNodes = [...nodesRef.current].sort((a, b) => b.opacity - a.opacity);
            
            for (const node of sortedNodes) {
                const hitRadius = node.radius + (isWideRef.current ? 4 : 8) / transform.current.scale;
                if (node.opacity > 0.5 && dist(node, worldClickPos) < hitRadius) {
                    clickedNode = node;
                    break;
                }
            }
            
            if (clickedNode) {
                if (isWideRef.current) {
                        if (focusedNodeRef.current && focusedNodeRef.current.skill.name === clickedNode.skill.name) {
                        selectSkill(clickedNode.skill);
                        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                        setFocusedNode(clickedNode);
                        setFocusedCategory(clickedNode.skill.category);
                    }
                } else {
                    setFocusedNode(clickedNode);
                    setFocusedCategory(clickedNode.skill.category);
                }
            } else {
                if (focusedNodeRef.current) {
                    if (isWideRef.current) {
                        setFocusedNode(null);
                        setFocusedCategory(null);
                        selectSkill(null);
                    } else {
                        handleCloseDialog();
                    }
                }
            }
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        canvas.addEventListener('click', handleClick);
        window.addEventListener('resize', handleResize);

        const currentColors = theme === 'dark' ? categoryColors.dark : categoryColors.light;

        const animate = (time: number) => {
            animationFrameId.current = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, width, height);
            
            const isWide = isWideRef.current;
            const isAnythingFocused = !!focusedNodeRef.current || !!focusedCategoryRef.current;
            if (!isAnythingFocused) { globalRotation.current += 0.0002; }

            const worldMousePos = mousePos.current ? {
                x: (mousePos.current.x - transform.current.x) / transform.current.scale,
                y: (mousePos.current.y - transform.current.y) / transform.current.scale
            } : null;

            hoveredNodeRef.current = worldMousePos ? nodesRef.current.find(node => dist(node, worldMousePos) < node.radius + 5) || null : null;
            canvas.style.cursor = hoveredNodeRef.current ? 'pointer' : 'default';
            
            let targetScale = 1.0, targetX = 0, targetY = 0;
            const verticalCenter = isWide ? height / 2 : height * 0.30;

            if (focusedNodeRef.current) {
                targetScale = isWide ? 1.2 : 1.2; // Reduced zoom on mobile
                targetX = width / 2 - focusedNodeRef.current.x * targetScale;
                targetY = verticalCenter - focusedNodeRef.current.y * targetScale;
            } else if (focusedCategoryRef.current) {
                const activeNodes = nodesRef.current.filter(n => n.skill.category === focusedCategoryRef.current);
                if (activeNodes.length > 0) {
                    const { x: sumX, y: sumY } = activeNodes.reduce((acc, n) => ({ x: acc.x + n.x, y: acc.y + n.y }), { x: 0, y: 0 });
                    const categoryCenterX = sumX / activeNodes.length;
                    const categoryCenterY = sumY / activeNodes.length;
                    
                    targetScale = isWide ? 1.05 : 1.1;
                    targetX = width / 2 - categoryCenterX * targetScale;
                    targetY = verticalCenter - categoryCenterY * targetScale;
                }
            }
            transform.current.scale += (targetScale - transform.current.scale) * 0.05;
            transform.current.x += (targetX - transform.current.x) * 0.05;
            transform.current.y += (targetY - transform.current.y) * 0.05;
            
            const canvasCenterX = width / 2, canvasCenterY = height / 2;
            nodesRef.current.forEach(node => {
                let targetHomeX, targetHomeY;
                if (isAnythingFocused) {
                    targetHomeX = node.homeX;
                    targetHomeY = node.homeY;
                } else {
                    const rotated = {
                        x: (node.homeX - canvasCenterX) * Math.cos(globalRotation.current) - (node.homeY - canvasCenterY) * Math.sin(globalRotation.current),
                        y: (node.homeX - canvasCenterX) * Math.sin(globalRotation.current) + (node.homeY - canvasCenterY) * Math.cos(globalRotation.current)
                    };
                    targetHomeX = canvasCenterX + rotated.x;
                    targetHomeY = canvasCenterY + rotated.y;
                }
                
                const isTheVeryFocusedNode = focusedNodeRef.current?.skill.name === node.skill.name;
                const isFocusedAndStable = isTheVeryFocusedNode && !isWide;
                
                let twinkle = { x: 0, y: 0 };
                if (!isFocusedAndStable) {
                    twinkle = { x: Math.cos(time * 0.0005 + node.animOffset) * node.z * 2, y: Math.sin(time * 0.0005 + node.animOffset) * node.z * 2 };
                }
                
                node.vx += (targetHomeX + twinkle.x - node.x) * 0.0002;
                node.vy += (targetHomeY + twinkle.y - node.y) * 0.0002;

                nodesRef.current.forEach(other => {
                    if (node === other) return;
                    const d = dist(node, other);
                    const minDistance = (node.radius + other.radius + 25);
                    if (d < minDistance) {
                        const angle = Math.atan2(node.y - other.y, node.x - other.x);
                        const force = (minDistance - d) * 0.005;
                        node.vx += Math.cos(angle) * force;
                        node.vy += Math.sin(angle) * force;
                    }
                });
                
                node.vx *= 0.96; node.vy *= 0.96;
                node.x += node.vx; node.y += node.vy;

                const padding = 5;
                if (node.x - node.radius < padding) { node.x = node.radius + padding; node.vx *= -0.7; } 
                else if (node.x + node.radius > width - padding) { node.x = width - node.radius - padding; node.vx *= -0.7; }
                if (node.y - node.radius < padding) { node.y = node.radius + padding; node.vy *= -0.7; } 
                else if (node.y + node.radius > height - padding) { node.y = height - node.radius - padding; node.vy *= -0.7; }

                const isNodeInFocusGroup = node.skill.category === (focusedNodeRef.current?.skill.category || focusedCategoryRef.current);
                if (!isAnythingFocused) {
                    node.targetOpacity = 1.0;
                    node.targetRadius = hoveredNodeRef.current === node ? (isWide ? 10 : 8) : (isWide ? 6 : 4);
                } else {
                    if (isNodeInFocusGroup) {
                        if (focusedNodeRef.current) {
                            const isTheVeryFocusedNode = focusedNodeRef.current?.skill.name === node.skill.name;
                            node.targetOpacity = isTheVeryFocusedNode ? 1.0 : 0.8;
                            if (isWide) {
                                node.targetRadius = isTheVeryFocusedNode ? 12 : (hoveredNodeRef.current === node ? 10 : 8);
                            } else {
                                node.targetRadius = isTheVeryFocusedNode ? 7 : (hoveredNodeRef.current === node ? 8 : 5);
                            }
                        } else {
                            node.targetOpacity = 1.0;
                            node.targetRadius = hoveredNodeRef.current === node ? (isWide ? 10 : 8) : (isWide ? 8 : 6);
                        }
                    } else {
                        node.targetOpacity = 0.15;
                        node.targetRadius = isWide ? 5 : 4;
                    }
                }
                node.radius += (node.targetRadius - node.radius) * 0.1;
                node.opacity += (node.targetOpacity - node.opacity) * 0.1;
            });
            
            ctx.save();
            ctx.translate(transform.current.x, transform.current.y);
            ctx.scale(transform.current.scale, transform.current.scale);
            
            ctx.lineWidth = 1;
            ctx.strokeStyle = currentColors.line;
            for (let i = 0; i < nodesRef.current.length; i++) {
                for (let j = i + 1; j < nodesRef.current.length; j++) {
                    const n1 = nodesRef.current[i];
                    const n2 = nodesRef.current[j];
                    if (n1.skill.category !== n2.skill.category) continue;
                    const d = dist(n1, n2);
                    if (d < (isWide ? 150 : 100)) {
                        ctx.globalAlpha = Math.min(n1.opacity, n2.opacity) * (1 - d / 150);
                        ctx.beginPath(); ctx.moveTo(n1.x, n1.y); ctx.lineTo(n2.x, n2.y); ctx.stroke();
                    }
                }
            }

            nodesRef.current.forEach(node => {
                ctx.beginPath(); ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = currentColors[node.skill.category as keyof typeof currentColors] || currentColors.line;
                ctx.globalAlpha = node.opacity;
                ctx.fill();
            });
            ctx.restore();

            const nodeToShowTooltip = hoveredNodeRef.current || focusedNodeRef.current;
            if (nodeToShowTooltip && isWide) {
                const screenNodePos = { x: nodeToShowTooltip.x * transform.current.scale + transform.current.x, y: nodeToShowTooltip.y * transform.current.scale + transform.current.y };
                drawTooltip(ctx, nodeToShowTooltip, screenNodePos, nodeToShowTooltip.radius * transform.current.scale, width, height, currentColors);
            }
        };
        
        const drawTooltip = (ctx: CanvasRenderingContext2D, node: any, position: Point, radius: number, canvasWidth: number, canvasHeight: number, colors: any) => {
            const padding = 10, titleFont = 'bold 14px Poppins', descFont = '11px Inter';
            const dotRadius = 4, titleLineHeight = 18, descLineHeight = 15, maxTooltipWidth = 200;

            ctx.font = titleFont; const title = node.skill.name;
            const categoryColor = colors[node.skill.category as keyof typeof colors] || colors.line;

            ctx.font = descFont;
            const descriptionLines = wrapText(ctx, node.skill.description, maxTooltipWidth - padding * 2);
            
            ctx.font = titleFont;
            const requiredWidth = Math.max(
                ctx.measureText(title).width + dotRadius * 2 + 8, 
                ...descriptionLines.map(l => { ctx.font = descFont; return ctx.measureText(l).width; })
            );
            const tooltipWidth = Math.min(maxTooltipWidth, requiredWidth + padding * 2);
            const tooltipHeight = padding * 2 + titleLineHeight + (descriptionLines.length > 0 ? 4 : 0) + (descriptionLines.length * descLineHeight);
            
            let tooltipX = position.x + radius + 15;
            let tooltipY = position.y - tooltipHeight / 2;
            if (tooltipX + tooltipWidth > canvasWidth - 10) { tooltipX = position.x - radius - tooltipWidth - 15; }
            if (tooltipY < 10) { tooltipY = 10; }
            if (tooltipY + tooltipHeight > canvasHeight - 10) { tooltipY = canvasHeight - tooltipHeight - 10; }
            
            ctx.fillStyle = colors.tooltipBg; ctx.globalAlpha = 0.95;
            ctx.beginPath(); ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 8); ctx.fill();
            ctx.globalAlpha = 1.0;

            ctx.fillStyle = categoryColor; ctx.beginPath();
            ctx.arc(tooltipX + padding, tooltipY + padding + titleLineHeight / 2 - 1, dotRadius, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = colors.tooltipText; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
            ctx.font = titleFont; ctx.fillText(title, tooltipX + padding + dotRadius * 2 + 4, tooltipY + padding);
            
            ctx.font = descFont;
            descriptionLines.forEach((line, index) => {
                ctx.fillText(line, tooltipX + padding, tooltipY + padding + titleLineHeight + 4 + (index * descLineHeight));
            });
        };

        animationFrameId.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            canvas.removeEventListener('click', handleClick);
        };
    }, [theme, skills, t, selectSkill, initializeNodes, categoryColors, setFocusedCategory, handleCloseDialog, handleFilterProjects]);

    const dialogShouldBeVisible = focusedNode && !isWideRef.current;
    const dialogCategoryColors = useMemo(() => theme === 'dark' ? categoryColors.dark : categoryColors.light, [theme, categoryColors]);

    return (
        <>
            <canvas ref={canvasRef} className="w-full h-full" />
            
            {dialogShouldBeVisible && (
                <div 
                    className="absolute inset-0 z-10 pointer-events-none flex justify-center items-end p-4"
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="skill-dialog-title"
                        className={`pointer-events-auto w-full max-w-sm p-3 bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-neutral-200/50 dark:border-neutral-800/50 ${isDialogClosing ? 'animate-slide-out-down' : 'animate-slide-in-up'}`}
                    >
                        <div
                            className="animate-fade-in"
                            style={{ animationDuration: '300ms', animationDelay: '50ms' }}
                        >
                             <div className="flex items-start justify-between gap-4 mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: dialogCategoryColors[focusedNode.skill.category] || dialogCategoryColors.line }}></span>
                                    <div>
                                        <h3 id="skill-dialog-title" className="text-base font-bold font-heading text-neutral-800 dark:text-neutral-100">
                                             {focusedNode.skill.name}
                                        </h3>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{t(`skills.categories.${focusedNode.skill.category}`)}</p>
                                    </div>
                                </div>
                                <button onClick={handleCloseDialog} className="p-1 -mr-1 -mt-1 rounded-full text-neutral-500 hover:bg-neutral-200/50 dark:text-neutral-400 dark:hover:bg-neutral-700/50" aria-label="Close skill details">
                                    <CloseIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="mb-3 text-xs text-neutral-600 dark:text-neutral-300">
                                {focusedNode.skill.description}
                            </p>

                            <button
                                onClick={() => handleFilterProjects(focusedNode.skill)}
                                className="btn-primary-gradient w-full px-3 py-1.5 text-sm font-semibold text-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-neutral-900 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                {t('skills.showProjects')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
});

export default SkillConstellation;
