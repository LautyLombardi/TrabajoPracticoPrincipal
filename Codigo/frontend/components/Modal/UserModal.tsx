import React from 'react'
import { Usuario } from '@/api/model/interfaces';

interface ModalProps {
    user: Usuario;
    handleCloseModal: () => void;
}

const UserModal: React.FC<ModalProps> = ({ user, handleCloseModal }) => {
    return (
        <div>
        
        </div>
    )
}

export default UserModal
