import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface TotpQrCodeProps {
    secret: string;
    email?: string;
    issuer?: string;
    size?: number;
}

export const TotpQrCode: React.FC<TotpQrCodeProps> = ({
    secret,
    email,
    issuer = 'Cognito App',
    size = 200,
}) => {
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const generateQRCode = async () => {
            try {
                // Create TOTP URI according to RFC 6238
                const userEmail = email || 'user';
                const totpUri = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(userEmail)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;

                const dataUrl = await QRCode.toDataURL(totpUri, {
                    width: size,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF',
                    },
                });

                setQrCodeDataUrl(dataUrl);
                setError('');
            } catch (err) {
                setError('Failed to generate QR code');
                console.error('QR code generation error:', err);
            }
        };

        if (secret) {
            generateQRCode();
        }
    }, [secret, email, issuer, size]);


    if (error) {
        return (
            <div className="flex flex-col items-center space-y-2">
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm text-gray-500">QR Code Error</span>
                </div>
                <p className="text-sm text-red-600">{error}</p>
            </div>
        );
    }

    if (!qrCodeDataUrl) {
        return (
            <div className="flex flex-col items-center space-y-2">
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm text-gray-500">Generating QR Code...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center space-y-3">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <img
                    src={qrCodeDataUrl}
                    alt="TOTP QR Code"
                    className="block"
                    style={{ width: size, height: size }}
                />
            </div>
            <p className="text-sm text-gray-600 text-center">
                Scan this QR code with your authenticator app
            </p>
        </div>
    );
};
