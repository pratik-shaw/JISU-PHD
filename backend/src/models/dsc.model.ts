// src/models/dsc.model.ts
export interface DSC {
    id: number;
    name: string;
    description: string | null;
    formation_date: Date | null;
    status: 'active' | 'inactive';
    created_at: Date;
}

export interface DscCreateDTO {
    name: string;
    description?: string;
    formation_date?: string; // Expecting string from client
}

export interface DscMember {
    id: number;
    user_id: number;
    dsc_id: number;
    role_in_dsc: 'supervisor' | 'co_supervisor' | 'member';
}

export interface DscMemberDTO {
    userId: number;
    dscId: number;
    role: 'supervisor' | 'co_supervisor' | 'member';
}
