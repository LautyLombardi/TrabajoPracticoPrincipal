import React from "react";
import { Visitante } from "@/api/model/interfaces";

interface ModalProps {
  visitor: Visitante;
  handleCloseModal: () => void;
}

const VisitorModal: React.FC<ModalProps> = ({ visitor, handleCloseModal }) => {
  return (
    <div>
    
    </div>
  )
};

export default VisitorModal;
