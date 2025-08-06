// private async generateUniqueReceiptNumber(): Promise<number> {
//   let receipt: number;
//   let exists = true;

//   while (exists) {
//     receipt = Math.floor(100000 + Math.random() * 900000); // 6 xonali random
//     const existing = await this.prismaService.payments.findUnique({
//       where: { receipt_number: receipt },
//     });
//     exists = !!existing;
//   }

//   return receipt;
// }
