import { ShedSpec, ShedStyleType } from '../types';

export const parseShedSpecFromSearchString = (searchString: string): ShedSpec | null => {
    const params = new URLSearchParams(searchString);
    if (!params.has('style')) return null;

    return {
        style: params.get('style') as ShedStyleType || 'Modern Studio',
        width: parseInt(params.get('width') || '10'),
        depth: parseInt(params.get('depth') || '12'),
        wallColor: params.get('color') ? `#${params.get('color')}` : '#f8fafc',
        sidingType: (params.get('siding') as any) || 'lap',
        addons: {
            ramp: params.get('ramp') === 'true',
            solar: params.get('solar') === 'true',
            ac: params.get('ac') === 'true',
            loft: params.get('loft') === 'true',
            workbench: params.get('workbench') === 'true',
            shedLoo: params.get('shedLoo') === 'true',
            power_20a: params.get('power_20a') === 'true',
            power_30a: params.get('power_30a') === 'true',
            power_50a: params.get('power_50a') === 'true',
            shedcare: params.get('shedcare') === 'true'
        },
        electricalTier: null,
        // Defaults
        material: 'Metal', terrain: 'grass', time: 50, viewMode: 'exterior',
        renderMode: '3D', inventory: [], landscape: [], pitch: 6, trimColor: '#334155', doorType: 'single'
    };
};
