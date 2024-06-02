import React from 'react'
import { Empresa } from '@/api/model/interfaces';

interface ModalProps {
    empresa: Empresa;
    handleCloseModal: () => void;
}

const EnterpriceModal: React.FC<ModalProps> = ({ empresa, handleCloseModal }) => {
    return (
        <div>
        
        </div>
    )
}

export default EnterpriceModal
