export const copyText = {
    consentHeaderTitle: "Consent Management",
    createBtnCreate: "Create New Consent",
    createBtnCancel: "Cancel",
    walletWarning: "Please connect your MetaMask wallet to manage consents",

    createFormTitle: "Create New Consent",
    formLabelPatientId: "Patient ID",
    formLabelPatientIdPlaceholder: "e.g., patient-001",
    formLabelPurpose: "Purpose",
    purposeSelectPlaceholder: "Select purpose...",
    submitCreate: "Sign & Create Consent",

    filterAll: "All",
    filterActive: "Active",
    filterPending: "Pending",
    filterRevoked: "Revoked",

    placeholderNoConsents: "No consents found.",

    consentPatientLabel: "Patient:",
    consentPurposeLabel: "Purpose:",
    consentStatusLabel: "Status:",
    consentCreatedLabel: "Created:",
    consentWalletLabel: "Wallet:",
    consentTxLabel: "Tx:",

    actionActivate: "Activate",
    actionRevoke: "Revoke",

    modalActivateTitle: "Activate Consent",
    modalRevokeTitle: "Revoke Consent",
    modalConfirmActivate: "Activate",
    modalConfirmRevoke: "Revoke",
    modalCancelText: "Cancel",
    modalConfirmBody: (action, patientId, purpose) => `Are you sure you want to ${action} consent for ${patientId} (${purpose})?`,

    connectWalletAlert: "Please connect your wallet first",
    loadingConsents: "Loading consents...",
    createFailedPrefix: "Failed to create consent: ",
    updateFailedPrefix: "Failed to update consent: ",
};

export default copyText;
