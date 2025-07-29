export interface Venda {
  id: string;
  nomeProduto: string;
  preco: number;
  quantidade: number;
  total: number;
  formaPagamento: "DINHEIRO" | "PIX" | "DEBITO" | "CREDITO";
  createAt: string;
  updateAt: string;
}

export interface VendaFormData {
  nomeProduto: string;
  preco: number;
  quantidade: number;
  total: number;
  formaPagamento: "DINHEIRO" | "PIX" | "DEBITO" | "CREDITO";
}

export interface VendasStats {
  totalVendido: number;
  produtosVendidos: number;
  vendasRealizadas: number;
  taxaConclusao: number;
}
