import { Button, Modal } from "flowbite-react";

interface ErrorModalProps {
  isOpen: boolean;
  errorMessage: string;
  onRequestClose: () => void;
}

const ErrorModal = ({
  isOpen,
  errorMessage,
  onRequestClose,
}: ErrorModalProps) => {
  return (
    <Modal position="top-center" show={isOpen} onClose={onRequestClose}>
      <Modal.Body className="modal-body !py-0">
        <p className="text-sm md:text-base leading-normal sm:leading-7 text-slate-600">
          {errorMessage}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <div className="mt-6 flex items-center justify-center w-full">
          <Button color="primary" onClick={onRequestClose}>
            OK
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ErrorModal;
