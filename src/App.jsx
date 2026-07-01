import { useMemo, useState } from 'react'

const emptyForm = {
  codigoPaciente: '',
  codigoTerapeuta: '',
  nombre: '',
  edad: '',
  fechaNacimiento: '',
  estadoCivil: '',
  ocupacion: '',
  direccion: 'Ñaña, Lima',
  motivoConsulta: '',
  problemaActual: '',
  historiaProblema: '',
  examMental: '',
  diagnosticoDSM5: '',
  codigoDSM5: '',
  diagnosticoCIE11: '',
  codigoCIE11: '',
  planIntervencion: '',
}

const dsm5 = [
  { label: 'Trastorno de ansiedad generalizada', code: '300.02' },
  { label: 'Trastorno depresivo mayor', code: '296.20' },
  { label: 'Trastorno de pánico', code: '300.01' },
  { label: 'Trastorno obsesivo-compulsivo', code: '300.3' },
]

const cie11 = [
  { label: 'Ansiedad generalizada', code: '6B00' },
  { label: 'Episodio depresivo', code: '6A70' },
  { label: 'Trastorno de pánico', code: '6B01' },
  { label: 'Trastorno obsesivo-compulsivo', code: '6B20' },
]

export default function App() {
  const [form, setForm] = useState(emptyForm)

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const onSelectDSM = (e) => {
    const item = dsm5.find(x => x.label === e.target.value)
    setForm(prev => ({
      ...prev,
      diagnosticoDSM5: item?.label || '',
      codigoDSM5: item?.code || '',
    }))
  }

  const onSelectCIE = (e) => {
    const item = cie11.find(x => x.label === e.target.value)
    setForm(prev => ({
      ...prev,
      diagnosticoCIE11: item?.label || '',
      codigoCIE11: item?.code || '',
    }))
  }

  const printHCC = () => window.print()

  const summary = useMemo(() => ([
    ['Paciente', form.nombre || '—'],
    ['Código Paciente', form.codigoPaciente || '—'],
    ['Código Terapeuta', form.codigoTerapeuta || '—'],
    ['DSM-5', form.diagnosticoDSM5 ? `${form.diagnosticoDSM5} (${form.codigoDSM5})` : '—'],
    ['CIE-11', form.diagnosticoCIE11 ? `${form.diagnosticoCIE11} (${form.codigoCIE11})` : '—'],
  ]), [form])

  return (
    <div className="app">
      <header className="topbar no-print">
        <div>
          <h1>Historia Clínica Conductual Cognitiva</h1>
          <p>Versión virtual para PC y móvil</p>
        </div>
        <div className="actions">
          <button onClick={printHCC}>Imprimir HCC</button>
          <button onClick={() => setForm(emptyForm)} className="secondary">Limpiar</button>
        </div>
      </header>

      <main className="grid">
        <section className="card no-print">
          <h2>Acceso</h2>
          <div className="two">
            <label>Código paciente
              <input name="codigoPaciente" value={form.codigoPaciente} onChange={onChange} />
            </label>
            <label>Código terapeuta
              <input name="codigoTerapeuta" value={form.codigoTerapeuta} onChange={onChange} />
            </label>
          </div>
        </section>

        <section className="card">
          <h2>Datos de filiación</h2>
          <div className="two">
            <label>Nombre completo
              <input name="nombre" value={form.nombre} onChange={onChange} />
            </label>
            <label>Edad
              <input name="edad" value={form.edad} onChange={onChange} />
            </label>
            <label>Fecha de nacimiento
              <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={onChange} />
            </label>
            <label>Estado civil
              <input name="estadoCivil" value={form.estadoCivil} onChange={onChange} />
            </label>
            <label>Ocupación
              <input name="ocupacion" value={form.ocupacion} onChange={onChange} />
            </label>
            <label>Dirección
              <input name="direccion" value={form.direccion} onChange={onChange} />
            </label>
          </div>
        </section>

        <section className="card">
          <h2>Motivo y problema</h2>
          <label>Motivo de consulta
            <textarea name="motivoConsulta" value={form.motivoConsulta} onChange={onChange} />
          </label>
          <label>Descripción del problema actual
            <textarea name="problemaActual" value={form.problemaActual} onChange={onChange} />
          </label>
          <label>Historia del problema
            <textarea name="historiaProblema" value={form.historiaProblema} onChange={onChange} />
          </label>
        </section>

        <section className="card">
          <h2>Examen mental</h2>
          <label>Registro clínico
            <textarea name="examMental" value={form.examMental} onChange={onChange} />
          </label>
        </section>

        <section className="card">
          <h2>Diagnóstico</h2>
          <div className="two">
            <label>DSM-5
              <select onChange={onSelectDSM} value={form.diagnosticoDSM5}>
                <option value="">Seleccionar</option>
                {dsm5.map(x => (
                  <option key={x.code} value={x.label}>
                    {x.label} — {x.code}
                  </option>
                ))}
              </select>
            </label>
            <label>Código DSM-5
              <input readOnly value={form.codigoDSM5} />
            </label>
            <label>CIE-11
              <select onChange={onSelectCIE} value={form.diagnosticoCIE11}>
                <option value="">Seleccionar</option>
                {cie11.map(x => (
                  <option key={x.code} value={x.label}>
                    {x.label} — {x.code}
                  </option>
                ))}
              </select>
            </label>
            <label>Código CIE-11
              <input readOnly value={form.codigoCIE11} />
            </label>
          </div>
        </section>

        <section className="card full print-block">
          <h2>Plan de intervención</h2>
          <label>Objetivos y técnicas
            <textarea name="planIntervencion" value={form.planIntervencion} onChange={onChange} />
          </label>
        </section>

        <section className="card full print-block">
          <h2>Resumen para impresión</h2>
          <table>
            <tbody>
              {summary.map(([k, v]) => (
                <tr key={k}>
                  <th>{k}</th>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  )
}
