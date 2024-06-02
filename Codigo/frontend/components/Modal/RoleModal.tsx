import React from 'react'
import { Rol } from '@/api/model/interfaces';

interface ModalProps {
    role: Rol;
    handleCloseModal: () => void;
}

const RoleModal: React.FC<ModalProps> = ({ role, handleCloseModal }) => {
    return (
        <div>
        
        </div>
    )
}

export default RoleModal
