import { Injectable } from '@nestjs/common';
import { createCanvas } from 'canvas';
import { PDFDocument } from 'pdf-lib';
import { Client } from 'src/clients/entities/client.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class StampService {
  async aplicarCarimboBufferNoPDF(
    pdfBuffer: Express.Multer.File,
    doctor: User,
    client: Client,
  ): Promise<Buffer> {
    const pdfDoc = await PDFDocument.load(pdfBuffer.buffer);

    const carimboBuffer = this.genarateStampBuffer(
      doctor.fullName,
      doctor.id,
      client.fullName,
      client.id,
    );

    const carimboImage = await pdfDoc.embedPng(carimboBuffer);

    const paginas = pdfDoc.getPages();
    const ultimaPagina = paginas[paginas.length - 1];
    const { width } = ultimaPagina.getSize();

    const larguraImagem = 250;
    const alturaImagem =
      (carimboImage.height / carimboImage.width) * larguraImagem;

    ultimaPagina.drawImage(carimboImage, {
      x: width - larguraImagem - 20,
      y: 20,
      width: larguraImagem,
      height: alturaImagem,
    });

    return Buffer.from(await pdfDoc.save());
  }

  private genarateStampBuffer(
    nomeDoctor: string,
    idDoctor: string,
    nomeClient: string,
    idClient: string,
  ): Buffer {
    const largura = 600;
    const altura = 130;
    const canvas = createCanvas(largura, altura);
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, largura, altura);
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';

    const data = new Date();
    const dataHoraFormatada =
      data.toISOString().replace('T', ' ').split('.')[0] + " -03'00";

    const linhas = [
      `${nomeClient}:${idClient}`,
      'Assinado de forma digital por',
      `${nomeDoctor}:${idDoctor}`,
      `Dados: ${dataHoraFormatada}`,
    ];

    linhas.forEach((linha, index) => {
      ctx.fillText(linha, 10, 25 * (index + 1));
    });

    return canvas.toBuffer('image/png');
  }
}
