import { Injectable } from '@nestjs/common';
import { createCanvas } from 'canvas';
import { PDFDocument } from 'pdf-lib';
import { Client } from 'src/clients/entities/client.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class StampService {
  async aplicarCarimboBufferNoPDF(
    pdfBuffer: Buffer,
    doctor: User,
    client: Client,
  ): Promise<Buffer> {
    const pdfDoc = await PDFDocument.load(pdfBuffer);

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
    // Aumentando a largura e altura para garantir espaço suficiente
    const largura = 600;
    const altura = 150;
    const canvas = createCanvas(largura, altura);
    const ctx = canvas.getContext('2d');

    // Limpar o canvas e configurar o estilo
    ctx.clearRect(0, 0, largura, altura);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, largura, altura);
    ctx.fillStyle = 'black';
    
    // Usar uma fonte mais compatível e aumentar o tamanho
    ctx.font = 'bold 14px Arial';

    const data = new Date();
    // Formatando a data de forma mais simples para evitar problemas de codificação
    const dataHoraFormatada = data.toLocaleString('pt-BR', { 
      timeZone: 'America/Sao_Paulo' 
    });

    const linhas = [
      `${nomeClient} (ID: ${idClient})`,
      'Assinado digitalmente por:',
      `${nomeDoctor} (ID: ${idDoctor})`,
      `Data: ${dataHoraFormatada}`,
    ];

    // Aumentando o espaçamento entre as linhas
    linhas.forEach((linha, index) => {
      ctx.fillText(linha, 10, 30 * (index + 1));
    });

    return canvas.toBuffer('image/png');
  }
}
