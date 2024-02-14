import {
    CloseIcon,
    Icon,
    Modal,
    ModalBackdrop,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader
} from "@gluestack-ui/themed";
import {Text} from "react-native";
import {COLORS} from "../../constants";
import DatePicker, {getFormatedDate} from "react-native-modern-datepicker";
import React from "react";

const DateSelectionModal = ({
                                isOpen,
                                onClose,
                                title,
                                onDateChange,
                                selected, startDate
                            }) => (
    <Modal isOpen={isOpen} onClose={onClose} size={'md'}>
        <ModalBackdrop/>
        <ModalContent>
            <ModalHeader style={{alignItems: 'center'}}>
                <Text style={{color: COLORS.darkGray}}>{title}</Text>
                <ModalCloseButton style={{}}>
                    <Icon as={CloseIcon}/>
                </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
                <DatePicker
                    selected={selected}
                    maximumDate={getFormatedDate(new Date(), 'DD-MM-YYYY')}
                    minimumDate={title === 'Select End Date' ? startDate : null}
                    mode={'calendar'}
                    options={{
                        backgroundColor: COLORS.bg,
                        textHeaderColor: COLORS.primary,
                        textDefaultColor: '#000000',
                        selectedTextColor: '#fff',
                        mainColor: COLORS.primary,
                        textSecondaryColor: '#000000',
                        borderColor: 'rgba(122, 146, 165, 0.1)',
                    }}
                    onDateChange={onDateChange}
                />
            </ModalBody>
        </ModalContent>
    </Modal>
);


export default React.memo(DateSelectionModal);
