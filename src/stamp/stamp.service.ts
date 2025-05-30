import { Injectable } from '@nestjs/common';
import { createCanvas, registerFont } from 'canvas';
import { PDFDocument } from 'pdf-lib';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class StampService {
  async aplicarCarimboBufferNoPDF(
    pdfBuffer: Buffer,
    doctor: User,
    crm: string,
  ): Promise<Buffer> {
    registerFont('src/assets/fonts/LiberationSans-Regular.ttf', {
      family: 'LiberationSans',
    });
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    const paginas = pdfDoc.getPages();
    const ultimaPagina = paginas[paginas.length - 1];
    const { width, height } = ultimaPagina.getSize();

    const larguraCarimbo = width * 0.25;

    const carimboBuffer = this.genarateStampBuffer(doctor.fullName, crm);
    const carimboImage = await pdfDoc.embedPng(carimboBuffer);

    const alturaCarimbo =
      (carimboImage.height / carimboImage.width) * larguraCarimbo;

    const margemX = width * 0.03;
    const margemY = height * 0.03;

    ultimaPagina.drawImage(carimboImage, {
      x: width - larguraCarimbo - margemX,
      y: margemY,
      width: larguraCarimbo,
      height: alturaCarimbo,
    });

    return Buffer.from(await pdfDoc.save());
  }

  private genarateStampBuffer(nomeDoctor: string, crm: string): Buffer {
    const largura = 400;
    const altura = 100;
    const canvas = createCanvas(largura, altura);
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, largura, altura);

    ctx.fillStyle = 'black';

    ctx.font = 'bold 16px LiberationSans';

    const data = new Date();
    const dataHoraFormatada = data.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
    });

    const linhas = [
      'Assinado digitalmente por:',
      `${nomeDoctor} CRM: ${crm}`,
      `Data: ${dataHoraFormatada}`,
    ];

    linhas.forEach((linha, index) => {
      ctx.fillText(linha, 10, 25 * (index + 1));
    });

    return canvas.toBuffer('image/png');
  }
}
