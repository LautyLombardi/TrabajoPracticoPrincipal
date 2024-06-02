import React from 'react'
import { Excepcion } from '@/api/model/interfaces';

interface ModalProps {
    excepcion: Excepcion;
    handleCloseModal: () => void;
}

const ExceptionModal: React.FC<ModalProps> = ({ excepcion, handleCloseModal }) => {
    return (
        <div>
        
        </div>
    )
}

export default ExceptionModal
