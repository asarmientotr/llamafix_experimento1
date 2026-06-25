import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Tecnico {
  id: number;
  nombre: string;
  calificacion: number;
  trabajos: number;
  experiencia: number;
  precio: number;
  fecha: string;
  horario: string;
  certificaciones: string[];
  redes: string[];
  resenas: string[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="frame">
      <!-- ====================== PANTALLA 1 ====================== -->
      <div class="screen" *ngIf="pantalla() === 1">
        <div class="topbar">
          <span class="step">Paso 1 de 3</span>
          <span class="title">Técnicos disponibles</span>
        </div>

        <div class="job">
          <div class="job-label">Trabajo publicado</div>
          <div class="job-title">Instalación de puerta de melamina en dormitorio principal</div>
          <div class="job-meta">
            <span>Distrito: San Miguel</span>
            <span>Precio base: S/120</span>
          </div>
        </div>

        <div class="list-label">{{ tecnicos.length }} técnicos postulando</div>

        <div class="card" *ngFor="let t of tecnicos">
          <div class="card-head">
            <div class="avatar">
              <svg viewBox="0 0 48 48" aria-hidden="true">
                <rect width="48" height="48" fill="#d6d6d6"/>
                <circle cx="24" cy="19" r="9" fill="#aeaeae"/>
                <path d="M8 44c0-9 7-15 16-15s16 6 16 15z" fill="#aeaeae"/>
              </svg>
            </div>
            <div class="card-name">
              <span class="name">{{ t.nombre }}</span>
              <div class="rating">
                <span class="star">★</span> {{ t.calificacion }}
                <span class="sep">·</span> {{ t.trabajos }} trabajos
              </div>
              <div class="exp">{{ t.experiencia }} años de experiencia</div>
            </div>
          </div>

          <div class="offer">
            <div class="offer-block">
              <span class="o-val">S/{{ t.precio }}</span>
              <span class="o-lbl">Precio propuesto</span>
            </div>
            <div class="offer-block">
              <span class="o-val">{{ t.fecha }}</span>
              <span class="o-lbl">{{ t.horario }}</span>
            </div>
          </div>

          <button class="btn-outline" (click)="verPerfil(t)">Ver perfil</button>
        </div>
      </div>

      <!-- ====================== PANTALLA 2 ====================== -->
      <div class="screen" *ngIf="pantalla() === 2 && seleccionado() as t">
        <div class="topbar">
          <button class="back" (click)="pantalla.set(1)">‹ Volver</button>
          <span class="title">Perfil del técnico</span>
        </div>

        <div class="profile-head">
          <div class="avatar lg">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <rect width="64" height="64" fill="#d6d6d6"/>
              <circle cx="32" cy="25" r="12" fill="#aeaeae"/>
              <path d="M10 60c0-12 10-20 22-20s22 8 22 20z" fill="#aeaeae"/>
            </svg>
          </div>
          <div class="profile-name">{{ t.nombre }}</div>
          <div class="rating big"><span class="star">★</span> {{ t.calificacion }} · {{ t.trabajos }} trabajos completados</div>
          <div class="exp center">{{ t.experiencia }} años de experiencia</div>
        </div>

        <!-- Portafolio de trabajos anteriores -->
        <div class="block">
          <div class="block-lbl">Trabajos anteriores</div>
          <div class="gallery">
            <div class="gphoto" *ngFor="let g of [1,2,3]">
              <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                <rect width="100" height="100" fill="#e6e6e6"/>
                <rect x="20" y="24" width="60" height="52" fill="#f2f2f2" stroke="#bdbdbd" stroke-width="2"/>
                <rect x="28" y="34" width="20" height="42" fill="#dcdcdc"/>
                <line x1="20" y1="76" x2="80" y2="76" stroke="#9a9a9a" stroke-width="3"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Redes sociales -->
        <div class="block">
          <div class="block-lbl">Redes sociales</div>
          <div class="social-list">
            <div class="social" *ngFor="let r of t.redes">
              <span class="social-dot"></span>{{ r }}
            </div>
          </div>
        </div>

        <!-- Documentación / certificaciones -->
        <div class="block">
          <div class="block-lbl">Documentación y certificaciones</div>
          <div class="doc" *ngFor="let c of t.certificaciones">
            <span class="doc-icon">▣</span>{{ c }}
          </div>
        </div>

        <div class="offer profile-offer">
          <div class="offer-block">
            <span class="o-val">S/{{ t.precio }}</span>
            <span class="o-lbl">Precio propuesto</span>
          </div>
          <div class="offer-block">
            <span class="o-val">{{ t.fecha }}</span>
            <span class="o-lbl">{{ t.horario }}</span>
          </div>
        </div>

        <div class="reviews">
          <div class="reviews-label">Reseñas</div>
          <div class="review" *ngFor="let r of t.resenas">
            <span class="star">★★★★★</span>
            <p>"{{ r }}"</p>
          </div>
        </div>

        <button class="btn-solid" (click)="aceptar(t)">Aceptar propuesta</button>
      </div>

      <!-- ====================== PANTALLA 3 ====================== -->
      <div class="screen" *ngIf="pantalla() === 3 && seleccionado() as t">
        <div class="topbar">
          <span class="step">Paso 3 de 3</span>
          <span class="title">Confirmación</span>
        </div>

        <div class="confirm-card">
          <div class="confirm-row">
            <span class="c-lbl">Técnico seleccionado</span>
            <span class="c-val">{{ t.nombre }}</span>
          </div>
          <div class="divider"></div>
          <div class="confirm-row">
            <span class="c-lbl">Precio aceptado</span>
            <span class="c-val">S/{{ t.precio }}</span>
          </div>
          <div class="divider"></div>
          <div class="confirm-row">
            <span class="c-lbl">Fecha y horario</span>
            <span class="c-val">{{ t.fecha }} · {{ t.horario }}</span>
          </div>
        </div>

        <div class="notice">
          Se compartirá la dirección de la vivienda con el técnico seleccionado.
        </div>

        <button class="btn-solid" (click)="confirmar()">Confirmar contratación</button>
        <button class="btn-text" (click)="pantalla.set(1)">Volver a comparar</button>
      </div>

      <!-- ====================== FIN ====================== -->
      <div class="screen end" *ngIf="pantalla() === 4">
        <div class="check">✓</div>
        <div class="end-title">Contratación confirmada</div>
        <div class="end-sub">Fin del prototipo de validación.</div>
        <button class="btn-outline" (click)="reiniciar()">Reiniciar</button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex; justify-content: center;
      background: #e9e9e9; min-height: 100vh;
      font-family: -apple-system, 'Segoe UI', Roboto, sans-serif;
      color: #1f1f1f;
    }
    .frame {
      width: 100%; max-width: 390px; background: #fafafa;
      min-height: 100vh; box-shadow: 0 0 0 1px #d8d8d8;
    }
    .screen { padding: 16px 16px 40px; }

    .topbar {
      display: flex; flex-direction: column; gap: 2px;
      padding-bottom: 14px; margin-bottom: 14px;
      border-bottom: 1px solid #dcdcdc;
    }
    .step { font-size: 11px; color: #8a8a8a; letter-spacing: .04em; text-transform: uppercase; }
    .title { font-size: 17px; font-weight: 600; }
    .back { background: none; border: none; padding: 0 0 4px; font-size: 13px; color: #555; cursor: pointer; text-align: left; }

    .job {
      background: #f0f0f0; border: 1px solid #d8d8d8; border-radius: 8px;
      padding: 12px; margin-bottom: 18px;
    }
    .job-label { font-size: 10px; text-transform: uppercase; letter-spacing: .05em; color: #8a8a8a; margin-bottom: 4px; }
    .job-title { font-size: 14px; font-weight: 600; line-height: 1.35; margin-bottom: 8px; }
    .job-meta { display: flex; justify-content: space-between; font-size: 12px; color: #5a5a5a; }

    .list-label { font-size: 12px; color: #7a7a7a; margin-bottom: 10px; }

    .card {
      border: 1px solid #d8d8d8; border-radius: 10px; background: #fff;
      padding: 14px; margin-bottom: 14px;
    }
    .card-head { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
    .avatar {
      width: 48px; height: 48px; border-radius: 50%; overflow: hidden;
      flex-shrink: 0; background: #d6d6d6;
    }
    .avatar svg { width: 100%; height: 100%; display: block; }
    .avatar.lg { width: 72px; height: 72px; margin: 0 auto 10px; }
    .card-name { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
    .name { font-size: 15px; font-weight: 600; }
    .rating { font-size: 13px; color: #555; }
    .rating.big { font-size: 14px; }
    .star { color: #6b6b6b; }
    .sep { margin: 0 4px; color: #bbb; }
    .exp { font-size: 12.5px; color: #777; }
    .exp.center { text-align: center; margin-top: 2px; }

    .offer { display: flex; gap: 10px; margin-bottom: 12px; }
    .offer-block {
      flex: 1; border: 1px solid #e0e0e0; border-radius: 8px;
      padding: 8px 10px; display: flex; flex-direction: column; gap: 2px;
    }
    .o-val { font-size: 15px; font-weight: 700; }
    .o-lbl { font-size: 10px; color: #8a8a8a; }

    .btn-outline {
      width: 100%; padding: 10px; border: 1px solid #9a9a9a; background: #fff;
      border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; color: #1f1f1f;
    }
    .btn-outline:active { background: #f0f0f0; }
    .btn-solid {
      width: 100%; padding: 13px; border: none;
      background: #2b2b2b; color: #fff; border-radius: 8px;
      font-size: 15px; font-weight: 600; cursor: pointer; margin-top: 6px;
    }
    .btn-solid:active { background: #000; }
    .btn-text {
      width: 100%; padding: 12px; border: none; background: none;
      color: #777; font-size: 13px; cursor: pointer; margin-top: 4px;
    }

    .profile-head { text-align: center; margin-bottom: 18px; }
    .profile-name { font-size: 18px; font-weight: 600; }
    .profile-offer { margin: 4px 0 18px; }

    .block { margin-bottom: 18px; }
    .block-lbl { font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: #8a8a8a; margin-bottom: 8px; }

    .gallery { display: flex; gap: 8px; }
    .gphoto { flex: 1; }
    .gphoto svg {
      width: 100%; aspect-ratio: 1; border-radius: 8px;
      border: 1px solid #d8d8d8; display: block;
    }

    .social-list { display: flex; flex-direction: column; gap: 7px; }
    .social { display: flex; align-items: center; gap: 9px; font-size: 13.5px; color: #444; }
    .social-dot {
      width: 9px; height: 9px; border-radius: 50%;
      background: #9a9a9a; flex-shrink: 0;
    }

    .doc { display: flex; align-items: center; gap: 9px; font-size: 13.5px; color: #444; padding: 4px 0; }
    .doc-icon { color: #8a8a8a; }

    .reviews { margin-bottom: 20px; }
    .reviews-label { font-size: 13px; font-weight: 600; margin-bottom: 10px; }
    .review { border-top: 1px solid #e4e4e4; padding: 10px 0; }
    .review .star { font-size: 11px; letter-spacing: 1px; }
    .review p { margin: 4px 0 0; font-size: 13px; color: #444; line-height: 1.4; }

    .confirm-card {
      border: 1px solid #d8d8d8; border-radius: 10px; background: #fff;
      padding: 4px 14px; margin-bottom: 16px;
    }
    .confirm-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 14px 0; }
    .c-lbl { font-size: 13px; color: #7a7a7a; }
    .c-val { font-size: 14px; font-weight: 600; text-align: right; }
    .divider { height: 1px; background: #ececec; }

    .notice {
      background: #f0f0f0; border: 1px solid #dcdcdc; border-radius: 8px;
      padding: 12px; font-size: 13px; color: #555; line-height: 1.4;
      margin-bottom: 18px; text-align: center;
    }

    .end { text-align: center; padding-top: 80px; }
    .check {
      width: 64px; height: 64px; border-radius: 50%;
      background: #2b2b2b; color: #fff; font-size: 30px;
      display: flex; align-items: center; justify-content: center; margin: 0 auto 18px;
    }
    .end-title { font-size: 18px; font-weight: 600; }
    .end-sub { font-size: 13px; color: #8a8a8a; margin: 6px 0 24px; }
  `]
})
export class AppComponent {
  pantalla = signal(1);
  seleccionado = signal<Tecnico | null>(null);

  tecnicos: Tecnico[] = [
    {
      id: 1, nombre: 'Carlos Ramírez',
      calificacion: 4.8, trabajos: 47, experiencia: 8,
      precio: 130, fecha: 'Sáb 28 jun', horario: '9:00 a.m.',
      certificaciones: ['Constancia SENATI - Carpintería', 'Certificado de instalación de melamina'],
      redes: ['Instagram · @carlos.carpinteria', 'Facebook · Carpintería Ramírez'],
      resenas: [
        'Instaló la puerta en 2 horas y dejó todo limpio.',
        'Trabajo muy profesional y puntual.',
        'Buena comunicación durante todo el servicio.'
      ]
    },
    {
      id: 2, nombre: 'Luis Fernández',
      calificacion: 4.9, trabajos: 89, experiencia: 12,
      precio: 145, fecha: 'Sáb 28 jun', horario: '10:00 a.m.',
      certificaciones: ['Constancia SENATI - Carpintería', 'Certificado en acabados de madera'],
      redes: ['Instagram · @lf.acabados', 'TikTok · @luisfernandez.obras'],
      resenas: [
        'Instaló la puerta en 2 horas y dejó todo limpio.',
        'Trabajo muy profesional y puntual.',
        'Buena comunicación durante todo el servicio.'
      ]
    },
    {
      id: 3, nombre: 'Miguel Quispe',
      calificacion: 4.5, trabajos: 23, experiencia: 4,
      precio: 110, fecha: 'Dom 29 jun', horario: '11:00 a.m.',
      certificaciones: ['Certificado técnico en carpintería'],
      redes: ['Facebook · Miguel Quispe Servicios'],
      resenas: [
        'Instaló la puerta en 2 horas y dejó todo limpio.',
        'Trabajo muy profesional y puntual.',
        'Buena comunicación durante todo el servicio.'
      ]
    }
  ];

  verPerfil(t: Tecnico) { this.seleccionado.set(t); this.pantalla.set(2); }
  aceptar(t: Tecnico) { this.seleccionado.set(t); this.pantalla.set(3); }
  confirmar() { this.pantalla.set(4); }
  reiniciar() { this.seleccionado.set(null); this.pantalla.set(1); }
}
