import React from 'react'
import { Categoria } from '@/api/model/interfaces';

interface ModalProps {
    categoria: Categoria;
    handleCloseModal: () => void;
}

const CategoryModal: React.FC<ModalProps> = ({ categoria, handleCloseModal }) => {
    return (
        <div>
        
        </div>
    )
}

export default CategoryModal
