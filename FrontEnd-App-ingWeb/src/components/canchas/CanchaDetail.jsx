import { getDeporte } from '../../lib/deportes.js'
import { Icon } from '../ui/Icon.jsx'
import { GaleriaCancha } from './GaleriaCancha.jsx'

/**
 * CanchaDetail — columna de información del detalle (§4.3).
 *
 * Galería, título y valoración, dirección, características, descripción con
 * recomendaciones de calzado y normas, y la ficha de la sede. La tarjeta de
 * reserva con los horarios vive aparte, en `TarjetaReserva`, porque es la otra
 * mitad de la pantalla y tiene su propio estado.
 *
 * @param {{cancha: import('../../api/types.js').CanchaDetalle}} props
 */
export function CanchaDetail({ cancha }) {
  const dep = getDeporte(cancha.deporte)
  const etiquetaDeporte = cancha.deporteLabel ?? dep.label
  const ubicacion = [cancha.direccion, cancha.zona, cancha.sede].filter(Boolean).join(' · ')

  return (
    <div className="c-detalle">
      <GaleriaCancha
        imagenes={cancha.imagenes ?? []}
        nombre={cancha.nombre}
        deporteLabel={etiquetaDeporte}
        dot={dep.color}
        certificacion="Sede verificada"
      />

      <header className="c-detalle__head">
        <div className="c-detalle__titlerow">
          <h1 className="c-detalle__title">{cancha.nombre}</h1>

          {cancha.puntuacion ? (
            <p className="c-detalle__rating">
              <Icon name="star" size={16} fill weight={500} className="c-detalle__star" />
              <strong className="u-tabular">{cancha.puntuacion}</strong>
              <span className="u-muted u-tabular">({cancha.resenas} reseñas)</span>
            </p>
          ) : null}
        </div>

        {ubicacion ? (
          <p className="c-detalle__dir">
            <Icon name="location_on" size={18} />
            <span>{ubicacion}</span>
          </p>
        ) : null}
      </header>

      {cancha.amenidades?.length ? (
        <section className="c-detalle__block" aria-labelledby="detalle-amenidades">
          <span className="u-overline" id="detalle-amenidades">
            Características de la cancha
          </span>
          <ul className="c-detalle__amenidades">
            {cancha.amenidades.map((a) => (
              <li className="c-detalle__amenidad" key={a.label}>
                <Icon name={a.icon} size={18} className="c-detalle__amenidadicon" />
                {a.label}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="c-card c-card--pad c-detalle__card" aria-labelledby="detalle-sobre">
        <h2 id="detalle-sobre" className="c-detalle__h2">
          Sobre este espacio
        </h2>

        {cancha.descripcion ? <p className="c-detalle__prose">{cancha.descripcion}</p> : null}

        {cancha.calzado ? (
          <div className="c-detalle__nota">
            <Icon name="check_circle" size={24} className="c-detalle__notaicon" />
            <div>
              <p className="c-detalle__notatitle">{cancha.calzado.titulo}</p>
              <p className="c-detalle__notatext">{cancha.calzado.texto}</p>
            </div>
          </div>
        ) : null}

        {cancha.normas?.length ? (
          <div className="c-detalle__normas">
            <h3 className="c-detalle__h3">Normas de la sede</h3>
            <ul className="c-detalle__list">
              {cancha.normas.map((norma) => (
                <li className="c-detalle__listitem" key={norma}>
                  <span className="c-detalle__bullet" aria-hidden="true" />
                  {norma}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {cancha.sedeInfo ? (
        <section className="c-card c-card--pad c-detalle__card" aria-labelledby="detalle-ubicacion">
          <span className="u-overline">Ubicación y llegada</span>
          <h2 id="detalle-ubicacion" className="c-detalle__h2">
            {cancha.sedeInfo.nombre}
          </h2>
          <p className="c-detalle__prose">{cancha.sedeInfo.texto}</p>

          <div className="c-detalle__mapa">
            <Icon name="map" size={40} className="c-detalle__mapaicon" />
            <div className="c-detalle__mapacard">
              <Icon name={dep.icon} size={24} className="c-detalle__mapadot" />
              <div>
                <p className="c-detalle__mapatitle">{cancha.sede}</p>
                <p className="c-detalle__mapatext">{[cancha.direccion, cancha.zona].filter(Boolean).join(' · ')}</p>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
