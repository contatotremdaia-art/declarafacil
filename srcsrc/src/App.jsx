import { useState } from "react";

const CHECKLIST = [
  { id: 1, category: "Identificação", icon: "👤", items: ["CPF e RG", "Título de eleitor", "Endereço completo atualizado", "Data de nascimento e naturalidade"] },
  { id: 2, category: "Rendimentos", icon: "💼", items: ["Informe de rendimentos do empregador (DIRF)", "Comprovante de pró-labore (se sócio)", "Recibos de aluguéis recebidos", "Extratos bancários com rendimentos de investimentos"] },
  { id: 3, category: "Bens e Direitos", icon: "🏠", items: ["Escritura ou contrato de imóveis", "Documento de veículos (CRLV)", "Extratos de contas bancárias e investimentos (31/12)", "Contrato de participação societária"] },
  { id: 4, category: "Deduções", icon: "📋", items: ["Recibos de plano de saúde (titular e dependentes)", "Notas fiscais de médicos, dentistas, psicólogos", "Comprovante de pagamento de escola/faculdade", "PGBL/VGBL – informe da seguradora"] },
  { id: 5, category: "Dependentes", icon: "👨‍👩‍👧", items: ["CPF dos dependentes", "Certidão de nascimento dos filhos", "Comprovante de guarda/tutela, se aplicável"] },
  { id: 6, category: "Dívidas e Ônus", icon: "📄", items: ["Contratos de financiamento imobiliário", "Empréstimos bancários com saldo devedor"] },
];

const STATUS_STEPS = ["Aguardando Documentos", "Em Análise", "Em Elaboração", "Revisão Final", "Entregue"];

const MOCK_ORDERS = [
  { id: "IR-2024-001", year: "2024", status: 3, date: "05/03/2025", value: "R$ 290,00", paid: true },
  { id: "IR-2023-001", year: "2023", status: 4, date: "10/02/2024", value: "R$ 250,00", paid: true, file: true },
];

export default function App() {
  const [screen, setScreen] = useState("home");
  const [activeOrder, setActiveOrder] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", cpf: "", email: "", phone: "", year: "2024", renda: "", dependentes: "" });
  const [checkedDocs, setCheckedDocs] = useState({});
  const [pixCopied, setPixCopied] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const totalChecked = Object.values(checkedDocs).filter(Boolean).length;
  const totalItems = CHECKLIST.reduce((a, c) => a + c.items.length, 0);

  function toggleDoc(key) {
    setCheckedDocs(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function copyPix() {
    navigator.clipboard.writeText("00020126330014BR.GOV.BCB.PIX0111999999999990204IR20520400005303986540529.005802BR5920DeclaraFacil LTDA6009SAO PAULO62140510IR202400016304ABCD").catch(() => {});
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  }

  const StatusBadge = ({ s }) => {
    const colors = ["#F59E0B", "#3B82F6", "#8B5CF6", "#EC4899", "#10B981"];
    return (
      <span style={{ background: colors[s] + "20", color: colors[s], padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>
        {STATUS_STEPS[s]}
      </span>
    );
  };

  // SCREENS
  if (screen === "home") return (
    <div style={{ minHeight: "100vh", background: "#0D1117", fontFamily: "'Georgia', serif", color: "#F0EDE8" }}>
      {/* Header */}
      <div style={{ padding: "20px 28px", borderBottom: "1px solid #1E2732", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#00C896", letterSpacing: "-0.5px" }}>📊 DeclaraFácil</div>
          <div style={{ fontSize: 11, color: "#6B7280", letterSpacing: 2, textTransform: "uppercase", marginTop: 2 }}>Imposto de Renda Simplificado</div>
        </div>
        <button onClick={() => setScreen("orders")} style={{ background: "transparent", border: "1px solid #2D3748", color: "#9CA3AF", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
          Minhas Declarações
        </button>
      </div>

      {/* Hero */}
      <div style={{ padding: "60px 28px 40px", maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "#00C89615", border: "1px solid #00C89630", color: "#00C896", padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 24, letterSpacing: 1 }}>
          ✦ PRAZO 2025 ABERTO
        </div>
        <h1 style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-1px" }}>
          Sua declaração do IR <span style={{ color: "#00C896" }}>do jeito certo</span>
        </h1>
        <p style={{ color: "#9CA3AF", fontSize: 16, lineHeight: 1.7, marginBottom: 36 }}>
          Preencha seus dados, envie os documentos e receba sua declaração pronta. Simples, seguro e rápido.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 36 }}>
          {[["📤", "Envie seus docs"], ["⚡", "Fazemos tudo"], ["📩", "Receba pronto"]].map(([ic, lb]) => (
            <div key={lb} style={{ background: "#161B22", border: "1px solid #21262D", borderRadius: 12, padding: "16px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{ic}</div>
              <div style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.4 }}>{lb}</div>
            </div>
          ))}
        </div>

        <button onClick={() => { setScreen("new"); setStep(1); }} style={{ width: "100%", background: "linear-gradient(135deg, #00C896, #00A37A)", border: "none", color: "#0D1117", padding: "16px", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: "pointer", letterSpacing: "-0.3px" }}>
          Iniciar Declaração →
        </button>
        <div style={{ marginTop: 12, fontSize: 13, color: "#4B5563" }}>A partir de R$ 290,00 · Pagamento via PIX</div>
      </div>

      {/* Pricing */}
      <div style={{ padding: "0 28px 40px", maxWidth: 520, margin: "0 auto" }}>
        <div style={{ background: "#161B22", border: "1px solid #21262D", borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>O que está incluído</div>
          {["Elaboração completa da declaração", "Análise de documentos enviados", "Cálculo de restituição ou imposto devido", "Entrega via app com comprovante", "Suporte até a entrega final"].map(item => (
            <div key={item} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
              <span style={{ color: "#00C896", fontSize: 14 }}>✓</span>
              <span style={{ color: "#D1D5DB", fontSize: 14 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (screen === "orders") return (
    <div style={{ minHeight: "100vh", background: "#0D1117", fontFamily: "'Georgia', serif", color: "#F0EDE8" }}>
      <div style={{ padding: "20px 28px", borderBottom: "1px solid #1E2732", display: "flex", gap: 16, alignItems: "center" }}>
        <button onClick={() => setScreen("home")} style={{ background: "transparent", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 20 }}>←</button>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Minhas Declarações</div>
      </div>

      <div style={{ padding: 28, maxWidth: 520, margin: "0 auto" }}>
        <button onClick={() => { setScreen("new"); setStep(1); }} style={{ width: "100%", background: "#161B22", border: "1px dashed #2D3748", color: "#00C896", padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 20 }}>
          + Nova Declaração
        </button>

        {MOCK_ORDERS.map(order => (
          <div key={order.id} onClick={() => { setActiveOrder(order); setScreen("tracking"); }}
            style={{ background: "#161B22", border: "1px solid #21262D", borderRadius: 14, padding: 20, marginBottom: 14, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>IR {order.year}</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>{order.id} · {order.date}</div>
                <StatusBadge s={order.status} />
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, color: "#00C896", fontSize: 16 }}>{order.value}</div>
                {order.file && <div style={{ fontSize: 11, color: "#10B981", marginTop: 4 }}>📎 Declaração pronta</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (screen === "tracking" && activeOrder) return (
    <div style={{ minHeight: "100vh", background: "#0D1117", fontFamily: "'Georgia', serif", color: "#F0EDE8" }}>
      <div style={{ padding: "20px 28px", borderBottom: "1px solid #1E2732", display: "flex", gap: 16, alignItems: "center" }}>
        <button onClick={() => setScreen("orders")} style={{ background: "transparent", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 20 }}>←</button>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>IR {activeOrder.year}</div>
          <div style={{ fontSize: 12, color: "#6B7280" }}>{activeOrder.id}</div>
        </div>
      </div>

      <div style={{ padding: 28, maxWidth: 520, margin: "0 auto" }}>
        {/* Status Timeline */}
        <div style={{ background: "#161B22", border: "1px solid #21262D", borderRadius: 16, padding: 24, marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 20, textTransform: "uppercase", letterSpacing: 1 }}>Status do Serviço</div>
          {STATUS_STEPS.map((s, i) => {
            const done = i < activeOrder.status;
            const active = i === activeOrder.status;
            return (
              <div key={s} style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: i < STATUS_STEPS.length - 1 ? 0 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: done ? "#00C896" : active ? "#3B82F6" : "#21262D", border: active ? "2px solid #3B82F6" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>
                    {done ? "✓" : active ? "●" : ""}
                  </div>
                  {i < STATUS_STEPS.length - 1 && <div style={{ width: 2, height: 28, background: done ? "#00C896" : "#21262D", marginTop: 2 }} />}
                </div>
                <div style={{ paddingBottom: i < STATUS_STEPS.length - 1 ? 20 : 0 }}>
                  <div style={{ fontWeight: active ? 700 : 500, color: done ? "#00C896" : active ? "#F0EDE8" : "#4B5563", fontSize: 14 }}>{s}</div>
                  {active && <div style={{ fontSize: 12, color: "#3B82F6", marginTop: 2 }}>Em andamento...</div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment */}
        <div style={{ background: "#161B22", border: "1px solid #21262D", borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: 14, color: "#9CA3AF" }}>Valor pago</div>
            <div style={{ fontWeight: 700, color: "#00C896" }}>{activeOrder.value}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <div style={{ fontSize: 14, color: "#9CA3AF" }}>Pagamento</div>
            <div style={{ fontSize: 13, color: "#10B981" }}>✓ PIX Confirmado</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <div style={{ fontSize: 14, color: "#9CA3AF" }}>Data</div>
            <div style={{ fontSize: 13, color: "#D1D5DB" }}>{activeOrder.date}</div>
          </div>
        </div>

        {/* Download if ready */}
        {activeOrder.file && (
          <div style={{ background: "#00C89610", border: "1px solid #00C89630", borderRadius: 14, padding: 20 }}>
            <div style={{ fontWeight: 700, color: "#00C896", marginBottom: 6 }}>🎉 Declaração pronta!</div>
            <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 14 }}>Sua declaração foi concluída e está disponível para download.</div>
            <button style={{ width: "100%", background: "#00C896", border: "none", color: "#0D1117", padding: 12, borderRadius: 10, fontWeight: 800, cursor: "pointer", fontSize: 14 }}>
              📥 Baixar Declaração (PDF)
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // NEW DECLARATION FLOW
  if (screen === "new") return (
    <div style={{ minHeight: "100vh", background: "#0D1117", fontFamily: "'Georgia', serif", color: "#F0EDE8" }}>
      {/* Header */}
      <div style={{ padding: "20px 28px", borderBottom: "1px solid #1E2732", display: "flex", gap: 16, alignItems: "center" }}>
        <button onClick={() => step === 1 ? setScreen("home") : setStep(s => s - 1)} style={{ background: "transparent", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 20 }}>←</button>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Nova Declaração</div>
          <div style={{ fontSize: 12, color: "#6B7280" }}>Etapa {step} de 4</div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ height: 3, background: "#161B22" }}>
        <div style={{ height: "100%", background: "linear-gradient(90deg, #00C896, #00A37A)", width: `${(step / 4) * 100}%`, transition: "width 0.4s ease" }} />
      </div>

      <div style={{ padding: 28, maxWidth: 520, margin: "0 auto" }}>

        {/* STEP 1: Info básica */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.5px" }}>Seus dados</h2>
            <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 28 }}>Preencha as informações básicas para iniciar</p>

            {[
              { label: "Nome completo", key: "name", type: "text", placeholder: "Como no documento" },
              { label: "CPF", key: "cpf", type: "text", placeholder: "000.000.000-00" },
              { label: "E-mail", key: "email", type: "email", placeholder: "seu@email.com" },
              { label: "WhatsApp", key: "phone", type: "tel", placeholder: "(00) 00000-0000" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 13, color: "#9CA3AF", display: "block", marginBottom: 6 }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={formData[f.key]}
                  onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: "100%", background: "#161B22", border: "1px solid #2D3748", color: "#F0EDE8", padding: "12px 14px", borderRadius: 10, fontSize: 15, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}

            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 13, color: "#9CA3AF", display: "block", marginBottom: 6 }}>Ano-base da declaração</label>
              <select value={formData.year} onChange={e => setFormData(p => ({ ...p, year: e.target.value }))}
                style={{ width: "100%", background: "#161B22", border: "1px solid #2D3748", color: "#F0EDE8", padding: "12px 14px", borderRadius: 10, fontSize: 15, outline: "none" }}>
                <option>2024</option><option>2023</option><option>2022</option>
              </select>
            </div>

            <button onClick={() => setStep(2)} style={{ width: "100%", background: "linear-gradient(135deg, #00C896, #00A37A)", border: "none", color: "#0D1117", padding: 16, borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
              Continuar →
            </button>
          </div>
        )}

        {/* STEP 2: Checklist */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.5px" }}>Checklist de documentos</h2>
            <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 10 }}>Marque o que você tem disponível para enviar</p>
            <div style={{ background: "#161B22", border: "1px solid #2D3748", borderRadius: 10, padding: "10px 16px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "#9CA3AF" }}>Documentos confirmados</span>
              <span style={{ fontWeight: 800, color: "#00C896", fontSize: 18 }}>{totalChecked}<span style={{ color: "#4B5563", fontWeight: 400 }}>/{totalItems}</span></span>
            </div>

            {CHECKLIST.map(cat => (
              <div key={cat.id} style={{ marginBottom: 10 }}>
                <button onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                  style={{ width: "100%", background: "#161B22", border: "1px solid #21262D", borderRadius: 12, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", color: "#F0EDE8" }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{cat.icon} {cat.category}</span>
                  <span style={{ color: "#6B7280", fontSize: 12 }}>
                    {cat.items.filter((_, i) => checkedDocs[`${cat.id}-${i}`]).length}/{cat.items.length} · {expandedCategory === cat.id ? "▲" : "▼"}
                  </span>
                </button>
                {expandedCategory === cat.id && (
                  <div style={{ background: "#0D1117", border: "1px solid #21262D", borderTop: "none", borderRadius: "0 0 12px 12px", padding: "8px 18px 14px" }}>
                    {cat.items.map((item, i) => {
                      const key = `${cat.id}-${i}`;
                      return (
                        <div key={key} onClick={() => toggleDoc(key)}
                          style={{ display: "flex", gap: 12, alignItems: "center", padding: "9px 0", borderBottom: i < cat.items.length - 1 ? "1px solid #161B22" : "none", cursor: "pointer" }}>
                          <div style={{ width: 20, height: 20, borderRadius: 5, border: checkedDocs[key] ? "none" : "2px solid #374151", background: checkedDocs[key] ? "#00C896" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {checkedDocs[key] && <span style={{ color: "#0D1117", fontSize: 12, fontWeight: 900 }}>✓</span>}
                          </div>
                          <span style={{ fontSize: 14, color: checkedDocs[key] ? "#D1D5DB" : "#9CA3AF", textDecoration: checkedDocs[key] ? "line-through" : "none" }}>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            <div style={{ height: 20 }} />
            <button onClick={() => setStep(3)} style={{ width: "100%", background: "linear-gradient(135deg, #00C896, #00A37A)", border: "none", color: "#0D1117", padding: 16, borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
              Continuar →
            </button>
          </div>
        )}

        {/* STEP 3: Upload */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.5px" }}>Envio de documentos</h2>
            <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 24 }}>Anexe os documentos que você marcou no checklist. PDF, JPG ou PNG.</p>

            <label style={{ display: "block", background: "#161B22", border: "2px dashed #2D3748", borderRadius: 14, padding: "32px 20px", textAlign: "center", cursor: "pointer", marginBottom: 20 }}>
              <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }}
                onChange={e => {
                  const files = Array.from(e.target.files);
                  setUploadedFiles(prev => [...prev, ...files.map(f => f.name)]);
                }} />
              <div style={{ fontSize: 32, marginBottom: 10 }}>📎</div>
              <div style={{ fontWeight: 700, color: "#F0EDE8", marginBottom: 4 }}>Toque para selecionar arquivos</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>PDF, JPG ou PNG até 20MB cada</div>
            </label>

            {uploadedFiles.length > 0 && (
              <div style={{ background: "#161B22", border: "1px solid #21262D", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 10 }}>Arquivos anexados ({uploadedFiles.length})</div>
                {uploadedFiles.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "6px 0", borderBottom: i < uploadedFiles.length - 1 ? "1px solid #21262D" : "none" }}>
                    <span style={{ color: "#00C896" }}>📄</span>
                    <span style={{ fontSize: 13, color: "#D1D5DB", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f}</span>
                    <button onClick={() => setUploadedFiles(p => p.filter((_, j) => j !== i))}
                      style={{ marginLeft: "auto", background: "transparent", border: "none", color: "#4B5563", cursor: "pointer", fontSize: 16 }}>×</button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ background: "#F59E0B10", border: "1px solid #F59E0B30", borderRadius: 10, padding: 14, marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: "#F59E0B" }}>💡 Você também pode enviar documentos por WhatsApp após o pagamento</div>
            </div>

            <button onClick={() => setStep(4)} style={{ width: "100%", background: "linear-gradient(135deg, #00C896, #00A37A)", border: "none", color: "#0D1117", padding: 16, borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
              Continuar →
            </button>
          </div>
        )}

        {/* STEP 4: Pagamento PIX */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.5px" }}>Pagamento via PIX</h2>
            <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 24 }}>Após a confirmação do pagamento, iniciaremos a elaboração da sua declaração.</p>

            <div style={{ background: "#161B22", border: "1px solid #21262D", borderRadius: 16, padding: 24, marginBottom: 20 }}>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>Total a pagar</div>
                <div style={{ fontSize: 40, fontWeight: 800, color: "#00C896", letterSpacing: "-1px" }}>R$ 290,00</div>
                <div style={{ fontSize: 12, color: "#4B5563", marginTop: 4 }}>Declaração IRPF {formData.year} · 1 pessoa</div>
              </div>

              {/* QR Code simulado */}
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ display: "inline-block", background: "white", padding: 16, borderRadius: 12 }}>
                  <div style={{ width: 140, height: 140, display: "grid", gridTemplateColumns: "repeat(10,1fr)", gap: 1 }}>
                    {Array.from({ length: 100 }).map((_, i) => (
                      <div key={i} style={{ background: Math.random() > 0.5 ? "#000" : "#fff", borderRadius: 1 }} />
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 8 }}>Aponte a câmera do seu banco para o QR Code</div>
              </div>

              <div style={{ background: "#0D1117", border: "1px solid #2D3748", borderRadius: 10, padding: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Chave PIX (Copia e Cola)</div>
                <div style={{ fontSize: 11, color: "#D1D5DB", wordBreak: "break-all", fontFamily: "monospace", marginBottom: 10 }}>
                  00020126330014BR.GOV.BCB.PIX...IR2024
                </div>
                <button onClick={copyPix}
                  style={{ width: "100%", background: pixCopied ? "#00C89620" : "#1E2732", border: `1px solid ${pixCopied ? "#00C896" : "#2D3748"}`, color: pixCopied ? "#00C896" : "#9CA3AF", padding: "8px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                  {pixCopied ? "✓ Copiado!" : "📋 Copiar código PIX"}
                </button>
              </div>
            </div>

            <div style={{ background: "#161B22", border: "1px solid #21262D", borderRadius: 12, padding: 16, marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 10 }}>Resumo do pedido</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 14, color: "#6B7280" }}>Cliente</span>
                <span style={{ fontSize: 14, color: "#D1D5DB" }}>{formData.name || "—"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 14, color: "#6B7280" }}>CPF</span>
                <span style={{ fontSize: 14, color: "#D1D5DB" }}>{formData.cpf || "—"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 14, color: "#6B7280" }}>Ano-base</span>
                <span style={{ fontSize: 14, color: "#D1D5DB" }}>{formData.year}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, color: "#6B7280" }}>Documentos anexados</span>
                <span style={{ fontSize: 14, color: "#D1D5DB" }}>{uploadedFiles.length} arquivo(s)</span>
              </div>
            </div>

            <button onClick={() => { setScreen("orders"); }}
              style={{ width: "100%", background: "linear-gradient(135deg, #00C896, #00A37A)", border: "none", color: "#0D1117", padding: 16, borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer", marginBottom: 10 }}>
              ✓ Já realizei o pagamento
            </button>
            <div style={{ textAlign: "center", fontSize: 12, color: "#4B5563" }}>Você receberá a confirmação via e-mail e WhatsApp</div>
          </div>
        )}
      </div>
    </div>
  );

  return null;
}
