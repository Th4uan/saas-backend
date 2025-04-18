import forge from 'node-forge';
import { plainAddPlaceholder } from 'node-signpdf';
import { PDFDocument } from 'pdf-lib';
import signer from 'node-signpdf';

export async function signPdf(
  pdfBuffer: Buffer,
  pfxBuffer: Buffer,
  password: string,
): Promise<Buffer> {
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

  const privateKeyPem = forge.pki.privateKeyToPem(keyObj.key);
  const certificatePem = forge.pki.certificateToPem(certObj.cert);

  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const pdfBytes = await pdfDoc.save();

  const pdfBytesWithPlaceholder = plainAddPlaceholder({
    pdfBuffer: pdfBytes,
    reason: 'Document verification',
    signatureLength: 8192,
  });

  const signedPdf = signer.sign(pdfBytesWithPlaceholder, {
    key: privateKeyPem,
    cert: certificatePem,
    passphrase: password,
  });

  return signedPdf;
}
