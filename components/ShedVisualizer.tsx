
import React, { useMemo } from 'react';
import { ShedSpec, WeatherType, NatureAsset } from '../types';
import { SHED_DB, TERRAINS, NATURE_ASSETS, DOOR_OPTIONS } from '../constants';

interface ShedVisualizerProps {
    spec: ShedSpec;
    weather: WeatherType;
    focalFeature?: string | null;
}

const ShedVisualizer: React.FC<ShedVisualizerProps> = ({ spec, weather, focalFeature }) => {
    const isBlueprint = spec.renderMode === 'BLUEPRINT';
    const terrainData = TERRAINS.find(t => t.id === spec.terrain) || TERRAINS[0];

    // Seasonal Logic
    const currentMonth = new Date().getMonth(); // 0-11
    const isWinter = currentMonth <= 2 || currentMonth >= 10; // Nov - Mar
    const effectiveWeather = weather === 'clear' && isWinter ? 'snow' : weather;

    const sW = spec.width * 15;
    const sD = spec.depth * 15;
    const wTop = -120;
    const wL = -sW / 2;
    const wR = sW / 2;

    // GEOMETRY ENGINE
    const geo = useMemo(() => {
        const roofHeight = sW * (spec.pitch / 24);
        const depthOffset = sD * 0.4;

        if (spec.style === 'Modern Studio') {
            const studioPeak = wTop - (roofHeight * 1.2);
            return {
                walls: `M${wR} 0 L${wR} ${wTop} L${wL} ${wTop} L${wL} 0 Z`,
                walls3D: `M${wR} 0 L${wR + depthOffset} ${-depthOffset} L${wR + depthOffset} ${wTop - depthOffset} L${wR} ${wTop} Z`,
                roof: `M${wL - 10} ${wTop} L${wR + 10} ${studioPeak} L${wR + depthOffset + 10} ${studioPeak - depthOffset} L${wL + depthOffset - 10} ${wTop - depthOffset} Z`,
                gable: `M${wL} ${wTop} L${wR} ${studioPeak} L${wR} ${wTop} Z`,
                floor: `M${wL} 0 L${wR} 0 L${wR + depthOffset} ${-depthOffset} L${wL + depthOffset} ${-depthOffset} Z`
            };
        }

        if (spec.style === 'Quaker') {
            const quakerPeakY = wTop - (roofHeight * 1.6);
            const quakerPeakX = wL + (sW * 0.7);
            const frontEaveY = wTop + 15;
            return {
                walls: `M${wR} 0 L${wR} ${wTop} L${wL} ${wTop} L${wL} 0 Z`,
                walls3D: `M${wR} 0 L${wR + depthOffset} ${-depthOffset} L${wR + depthOffset} ${wTop - depthOffset} L${wR} ${wTop} Z`,
                roof: `M${wL - 15} ${wTop - 5} L${quakerPeakX} ${quakerPeakY} L${wR + 15} ${frontEaveY} L${wR + depthOffset + 15} ${frontEaveY - depthOffset} L${quakerPeakX + depthOffset} ${quakerPeakY - depthOffset} L${wL + depthOffset - 15} ${wTop - depthOffset - 5} Z`,
                sideRoof: `M${quakerPeakX} ${quakerPeakY} L${wR + 15} ${frontEaveY} L${wR + depthOffset + 15} ${frontEaveY - depthOffset} L${quakerPeakX + depthOffset} ${quakerPeakY - depthOffset} Z`,
                gable: `M${wL} ${wTop} L${quakerPeakX} ${quakerPeakY} L${wR} ${wTop} Z`,
                floor: `M${wL} 0 L${wR} 0 L${wR + depthOffset} ${-depthOffset} L${wL + depthOffset} ${-depthOffset} Z`
            };
        }

        if (spec.style === 'Lofted Barn') {
            const lowerPeakY = wTop - (roofHeight * 0.7);
            const highPeakY = wTop - (roofHeight * 1.5);
            const knuckleX = sW * 0.38;

            return {
                walls: `M${wR} 0 L${wR} ${wTop} L${wL} ${wTop} L${wL} 0 Z`,
                walls3D: `M${wR} 0 L${wR + depthOffset} ${-depthOffset} L${wR + depthOffset} ${wTop - depthOffset} L${wR} ${wTop} Z`,
                roof: `M${wL - 5} ${wTop} L${-knuckleX} ${lowerPeakY} L0 ${highPeakY} L${knuckleX} ${lowerPeakY} L${wR + 5} ${wTop} Z`,
                sideRoof: `M0 ${highPeakY} L${knuckleX} ${lowerPeakY} L${wR + 5} ${wTop} L${wR + depthOffset + 5} ${wTop - depthOffset} L${knuckleX + depthOffset} ${lowerPeakY - depthOffset} L${depthOffset} ${highPeakY - depthOffset} Z`,
                gable: `M${wL} ${wTop} L${-knuckleX} ${lowerPeakY} L0 ${highPeakY} L${knuckleX} ${lowerPeakY} L${wR} ${wTop} Z`,
                floor: `M${wL} 0 L${wR} 0 L${wR + depthOffset} ${-depthOffset} L${wL + depthOffset} ${-depthOffset} Z`
            };
        }

        // Default Gable / Utility / A-Frame
        const peak = wTop - roofHeight;
        return {
            walls: `M${wR} 0 L${wR} ${wTop} L${wL} ${wTop} L${wL} 0 Z`,
            walls3D: `M${wR} 0 L${wR + depthOffset} ${-depthOffset} L${wR + depthOffset} ${wTop - depthOffset} L${wR} ${wTop} Z`,
            roof: `M${wL - 5} ${wTop} L${wR + 5} ${wTop} L0 ${peak} Z`,
            sideRoof: `M0 ${peak} L${wR + 5} ${wTop} L${wR + depthOffset + 5} ${wTop - depthOffset} L${depthOffset} ${peak - depthOffset} Z`,
            gable: `M${wL} ${wTop} L0 ${peak} L${wR} ${wTop} Z`,
            floor: `M${wL} 0 L${wR} 0 L${wR + depthOffset} ${-depthOffset} L${wL + depthOffset} ${-depthOffset} Z`
        };
    }, [spec.style, spec.pitch, sW, sD, wL, wR, wTop]);

    const wallColor = isBlueprint ? '#1e3a8a' : spec.wallColor;
    const trimColor = isBlueprint ? 'white' : spec.trimColor;
    const roofColor = isBlueprint ? 'none' : (effectiveWeather === 'snow' ? '#e2e8f0' : '#1e293b');
    const lineColor = isBlueprint ? 'white' : '#020617';

    const env = useMemo(() => {
        const t = spec.time;
        let shadowSkew = t < 50 ? 60 - (t / 50) * 60 : -((t - 50) / 50) * 60;
        const isNight = t > 80 || t < 20;
        const isInterior = spec.viewMode === 'interior';
        return { shadowSkew, isNight, isInterior };
    }, [spec.time, spec.viewMode]);

    const sidingFill = spec.sidingType === 'lap' ? "url(#lapSiding)" : "url(#boardSiding)";

    const renderQueue = useMemo(() => {
        const queue: { type: 'shed' | 'prop', y: number, data?: any }[] = [{ type: 'shed', y: 0 }];
        spec.landscape.forEach(item => queue.push({ type: 'prop', y: item.y, data: item }));
        return queue.sort((a, b) => a.y - b.y);
    }, [spec.landscape]);

    return (
        <svg viewBox="0 0 500 500" className={`w-full max-w-[850px] h-auto relative z-10 transition-all duration-700 overflow-visible ${isBlueprint ? 'filter-[url(#sketch)]' : 'drop-shadow-2xl'}`}>
            <defs>
                <filter id="blurShadow"><feGaussianBlur in="SourceGraphic" stdDeviation="5" /></filter>
                <filter id="sketch">
                    <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                </filter>

                {/* Enhanced Horizontal Lap Siding Pattern */}
                <pattern id="lapSiding" width="100" height="15" patternUnits="userSpaceOnUse">
                    <rect width="100" height="15" fill={wallColor} />
                    {/* Bevel/Shadow effect for overlap */}
                    <rect width="100" height="2" y="13" fill="black" fillOpacity="0.15" />
                    <line x1="0" y1="13" x2="100" y2="13" stroke="black" strokeOpacity="0.1" strokeWidth="0.5" />
                    <line x1="0" y1="0" x2="100" y2="0" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />
                </pattern>

                {/* Enhanced Board & Batten Siding Pattern */}
                <pattern id="boardSiding" width="24" height="100" patternUnits="userSpaceOnUse">
                    <rect width="24" height="100" fill={wallColor} />
                    {/* The "Batten" */}
                    <rect width="4" height="100" x="20" fill={wallColor} />
                    {/* Side shadows for depth */}
                    <rect width="1.5" height="100" x="18.5" fill="black" fillOpacity="0.1" />
                    <rect width="0.5" height="100" x="20" fill="white" fillOpacity="0.08" />
                </pattern>

                <pattern id="floorGrid" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
                    <path d="M10 0 L0 0 L0 10" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="0.5" />
                </pattern>

                <pattern id="blueprintGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="0.5" />
                </pattern>
            </defs>

            {isBlueprint && (
                <rect width="100%" height="100%" fill="url(#blueprintGrid)" opacity="0.5" />
            )}

            <g
                transform={`
                    translate(250, 360) 
                    scale(${isBlueprint ? 1.2 : (focalFeature ? 1.8 : 1)}) 
                    translate(${focalFeature === 'roof' ? '0, 100' : (focalFeature === 'siding' ? '0, 50' : '0, 0')})
                `}
                className="transition-all duration-700 ease-in-out"
            >
                {!isBlueprint && (
                    <g transform={`skewX(${env.shadowSkew}) translate(${env.shadowSkew * -1.5}, 0)`}>
                        <ellipse cx="0" cy="10" rx={sW / 1.5} ry="35" fill="#000" opacity={effectiveWeather === 'clear' ? "0.4" : "0.15"} filter="url(#blurShadow)" />
                    </g>
                )}

                {!isBlueprint && <path d="M-220 0 L0 80 L220 0 L0 -80 Z" fill={effectiveWeather === 'snow' ? '#f1f5f9' : terrainData.color} className="transition-colors duration-1000" />}

                {effectiveWeather === 'snow' && !isBlueprint && (
                    <g opacity="0.6">
                        <circle cx="-150" cy="40" r="2" fill="white" className="animate-pulse" />
                        <circle cx="120" cy="-20" r="3" fill="white" className="animate-bounce" style={{ animationDuration: '3s' }} />
                        <circle cx="-80" cy="-60" r="2" fill="white" className="animate-pulse" style={{ animationDelay: '1s' }} />
                    </g>
                )}

                {renderQueue.map((obj, index) => {
                    if (obj.type === 'shed') {
                        return (
                            <g key="shed-group" className="transition-all duration-1000">
                                <g opacity={env.isInterior ? 1 : 0} className="transition-opacity duration-500">
                                    <path d={geo.floor} fill="#334155" stroke={lineColor} strokeWidth="1" />
                                    <path d={geo.floor} fill="url(#floorGrid)" />
                                </g>

                                {!isBlueprint && (
                                    <g>
                                        <path d={geo.walls3D} fill={sidingFill} stroke={lineColor} strokeWidth="1" />
                                        <path d={geo.walls3D} fill="black" fillOpacity="0.2" />
                                    </g>
                                )}
                                <path d={geo.walls} fill={sidingFill} stroke={lineColor} strokeWidth={isBlueprint ? 1.5 : 1.2} />

                                <g className="transition-all duration-700" style={{ transform: env.isInterior ? 'translateY(-150px)' : 'translateY(0px)' }}>
                                    {spec.style !== 'Modern Studio' && !isBlueprint && (
                                        <g>
                                            <path d={geo.sideRoof} fill={roofColor} stroke={lineColor} strokeWidth="1" />
                                            <path d={geo.sideRoof} fill="black" fillOpacity="0.2" />
                                        </g>
                                    )}
                                    <path d={geo.roof} fill={roofColor} stroke={lineColor} strokeWidth={isBlueprint ? 1.5 : 1.2} />
                                    <path d={geo.gable} fill={wallColor} stroke={lineColor} strokeWidth={isBlueprint ? 1.5 : 1.2} />
                                    <path d={geo.roof} fill="none" stroke={trimColor} strokeWidth="4" />
                                </g>

                                <g transform={`translate(${spec.doorType === 'double' ? -35 : -20}, -95)`} opacity={env.isInterior ? 0.3 : 1}>
                                    {DOOR_OPTIONS.find(d => d.id === spec.doorType)?.path.split('M').slice(1).map((p, i) => (
                                        <path key={i} d={`M${p}`} fill={isBlueprint ? 'none' : 'white'} stroke={lineColor} strokeWidth="2" />
                                    ))}
                                </g>

                                {spec.addons.shedLoo && !env.isInterior && (
                                    <g transform={`translate(${wL - 20}, -15)`}>
                                        <rect width="25" height="35" fill={wallColor} stroke={lineColor} strokeWidth="1.5" rx="2" />
                                        <path d="M0 0 L12.5 -8 L25 0" fill="none" stroke={lineColor} strokeWidth="1" />
                                        <text x="12.5" y="22" fontSize="10" textAnchor="middle" fill={lineColor} fontWeight="900" opacity="0.6">WC</text>
                                    </g>
                                )}
                            </g>
                        );
                    } else {
                        const p = obj.data;
                        const asset = NATURE_ASSETS.find(n => n.id === p.id);
                        if (!asset) return null;
                        return (
                            <g key={`prop-${index}`} transform={`translate(${p.x}, ${p.y}) scale(${p.scale})`} className="animate-sway origin-bottom">
                                <path d={asset.path} fill={isBlueprint ? "none" : asset.color} stroke={lineColor} strokeWidth={isBlueprint ? 1 : 0} />
                            </g>
                        );
                    }
                })}

                {/* VISUAL ADDONS (LEVEL 10) */}
                {!env.isInterior && !isBlueprint && (
                    <g>
                        {/* 4ft Aluminium Ramp */}
                        {spec.addons.ramp && (
                            <g transform={`translate(${spec.doorType === 'double' ? -35 : -20}, 0)`}>
                                <path d="M0 0 L40 0 L45 15 L-5 15 Z" fill="#94a3b8" stroke={lineColor} strokeWidth="1" />
                                <line x1="5" y1="2" x2="35" y2="2" stroke="white" strokeOpacity="0.2" />
                                <line x1="10" y1="7" x2="30" y2="7" stroke="white" strokeOpacity="0.2" />
                            </g>
                        )}

                        {/* Solar Array */}
                        {spec.addons.solar && (
                            <g transform={`translate(${wL + 20}, ${wTop - 80}) rotate(-15)`}>
                                <rect width="40" height="25" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" rx="1" />
                                <path d="M0 8 H40 M0 16 H40 M13 0 V25 M26 0 V25" stroke="#3b82f6" strokeOpacity="0.3" strokeWidth="1" />
                                <circle cx="35" cy="5" r="2" fill="#3b82f6" fillOpacity="0.4" />
                            </g>
                        )}

                        {/* AC Unit */}
                        {spec.addons.ac && (
                            <g transform={`translate(${wR + 5}, -40)`}>
                                <rect width="20" height="25" fill="#e2e8f0" stroke={lineColor} strokeWidth="1" rx="2" />
                                <circle cx="10" cy="12" r="7" fill="none" stroke={lineColor} strokeWidth="1" strokeDasharray="2 2" />
                                <rect width="12" height="2" x="4" y="20" fill={lineColor} fillOpacity="0.2" />
                            </g>
                        )}

                        {/* Power Kit Inlets */}
                        {(spec.addons.power_20a || spec.addons.power_30a || spec.addons.power_50a) && (
                            <g transform={`translate(${wR - 15}, -20)`}>
                                <circle r="5" fill="#1e293b" stroke={lineColor} strokeWidth="1" />
                                <path d="M-2 -2 L2 2 M-2 2 L2 -2" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
                                <path d="M0 0 L0 8" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" opacity="0.6" className="animate-pulse" />
                            </g>
                        )}
                    </g>
                )}

                {/* Dimension Overlays */}
                {isBlueprint && (
                    <g className="animate-in fade-in duration-1000">
                        {/* Width Label */}
                        <g transform={`translate(0, 40)`}>
                            <line x1={wL} y1="0" x2={wR} y2="0" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
                            <rect x="-25" y="-10" width="50" height="20" rx="4" fill="#1e3a8a" />
                            <text y="4" textAnchor="middle" fill="white" fontSize="10" fontWeight="900" className="font-mono">{spec.width}'</text>
                        </g>
                        {/* Depth Label */}
                        <g transform={`translate(${wR + 25}, ${-sD * 0.2}) rotate(-45)`}>
                            <line x1="0" y1="0" x2={sD * 0.5} y2="0" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
                            <rect x="15" y="-10" width="50" height="20" rx="4" fill="#1e3a8a" />
                            <text x="40" y="4" textAnchor="middle" fill="white" fontSize="10" fontWeight="900" className="font-mono">{spec.depth}'</text>
                        </g>

                        {/* Structural Notes */}
                        <g transform={`translate(${wL - 60}, ${wTop - 40})`}>
                            <text fill="white" fillOpacity="0.4" fontSize="8" fontWeight="bold" className="uppercase tracking-widest">
                                <tspan x="0" dy="1.2em">PLACED ENGINEERED</tspan>
                                <tspan x="0" dy="1.2em">ATLANTIC SPEC V12</tspan>
                                <tspan x="0" dy="1.2em">R-VALUE: {SHED_DB[spec.style].rVal}</tspan>
                            </text>
                        </g>
                    </g>
                )}
            </g>
        </svg>
    );
};

export default ShedVisualizer;
