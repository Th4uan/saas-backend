import * as forge from 'node-forge';
import { plainAddPlaceholder } from 'node-signpdf';
// import { PDFDocument } from 'pdf-lib';
import signer from 'node-signpdf';

export function signPdf(
  pdfBuffer: Buffer,
  pfxBuffer: Buffer,
  password: string,
) {
  const binaryBuffer = forge.util.createBuffer(pfxBuffer.toString('binary'));

  const p12Asn1 = forge.asn1.fromDer(binaryBuffer, false);

  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

  const keyBags =
    p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[
      forge.pki.oids.pkcs8ShroudedKeyBag
    ] ?? [];
  const keyObj = keyBags[0];

  const certBag =
    p12.getBags({ bagType: forge.pki.oids.certBag })[forge.pki.oids.certBag] ??
    [];
  const certObj = certBag[0];

  if (!keyObj.key || !certObj.cert) {
    throw new Error('No key or certificate found in PFX file');
  }

  // const privateKeyPem = forge.pki.privateKeyToPem(keyObj.key);
  // const certificatePem = forge.pki.certificateToPem(certObj.cert);

  const pdfBytesWithPlaceholder = plainAddPlaceholder({
    pdfBuffer: pdfBuffer,
    reason: 'Document verification',
    signatureLength: 8192,
  });

  const signedPdf = signer.sign(pdfBytesWithPlaceholder, pfxBuffer, {
    passphrase: password,
  });

  return signedPdf;
}
