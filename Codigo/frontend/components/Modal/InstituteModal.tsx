import React from 'react'
import { Instituto } from '@/api/model/interfaces';

interface ModalProps {
    instituto: Instituto;
    handleCloseModal: () => void;
}

const InstituteModal: React.FC<ModalProps> = ({ instituto, handleCloseModal }) => {
    return (
        <div>
        
        </div>
    )
}

export default InstituteModal
