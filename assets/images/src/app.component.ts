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
            <div class="avatar">{{ iniciales(t.nombre) }}</div>
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
          <img class="avatar lg" [src]="imagenes(t.nombre)">
          <div class="profile-name">{{ t.nombre }}</div>
          <div class="rating big"><span class="star">★</span> {{ t.calificacion }} · {{ t.trabajos }} trabajos completados</div>
          <div class="exp center">{{ t.experiencia }} años de experiencia</div>
        </div>

        <!-- Portafolio de trabajos anteriores -->
        <div class="block">
          <div class="block-lbl">Trabajos anteriores</div>
          <div class="gallery">
            <div class="gphoto" *ngFor="let g of [1,2,3]">
              <img [src]="'assets/images/trabajo' + g + '.jpg'" class="gphoto-img">
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
    /* ===================== PALETA DE MARCA =====================
       Amarillo:  #F5B800
       Negro:     #111111 / #1A1A1A
       Grises:    neutrales fríos para texto secundario
    ============================================================ */
    :host {
      display: flex; justify-content: center;
      background:
        radial-gradient(120% 60% at 50% 0%, #2a2a2a 0%, #111111 60%) fixed;
      min-height: 100vh;
      font-family: 'Inter', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif;
      color: #1A1A1A;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }
    .frame {
      width: 100%; max-width: 390px; background: #FFFFFF;
      min-height: 100vh;
      box-shadow: 0 24px 60px rgba(0,0,0,.45);
      position: relative;
    }
    /* barra superior de acento amarillo */
    .frame::before {
      content: ''; position: sticky; top: 0; display: block;
      height: 4px; background: linear-gradient(90deg, #F5B800, #FFD34D);
      z-index: 5;
    }
    .screen { padding: 18px 18px 44px; }

    .topbar {
      display: flex; flex-direction: column; gap: 3px;
      padding-bottom: 16px; margin-bottom: 18px;
      border-bottom: 2px solid #F3F3F0;
    }
    .step {
      font-size: 11px; font-weight: 700; color: #B8860B;
      letter-spacing: .12em; text-transform: uppercase;
    }
    .title { font-size: 20px; font-weight: 800; letter-spacing: -.01em; color: #111111; }
    .back {
      background: none; border: none; padding: 0 0 6px;
      font-size: 13px; font-weight: 600; color: #6B6B6B; cursor: pointer; text-align: left;
    }
    .back:hover { color: #111; }

    .job {
      background: #111111; border: none; border-radius: 14px;
      padding: 16px; margin-bottom: 22px; color: #fff;
      box-shadow: 0 8px 20px rgba(0,0,0,.18);
    }
    .job-label {
      font-size: 10px; text-transform: uppercase; letter-spacing: .14em;
      color: #F5B800; font-weight: 700; margin-bottom: 6px;
    }
    .job-title { font-size: 15px; font-weight: 700; line-height: 1.4; margin-bottom: 12px; color: #fff; }
    .job-meta { display: flex; justify-content: space-between; font-size: 12.5px; color: #C9C9C9; }
    .job-meta span:last-child { color: #F5B800; font-weight: 700; }

    .list-label { font-size: 12px; font-weight: 600; color: #8A8A85; margin-bottom: 12px; }

    .card {
      border: 1.5px solid #EFEFEC; border-radius: 16px; background: #fff;
      padding: 16px; margin-bottom: 16px;
      box-shadow: 0 2px 10px rgba(17,17,17,.04);
      transition: box-shadow .2s, border-color .2s;
    }
    .card:hover { box-shadow: 0 10px 24px rgba(17,17,17,.10); border-color: #F5B800; }
    .card-head { display: flex; align-items: center; gap: 13px; margin-bottom: 16px; }

    /* ====== AVATAR: placeholder sólido amarillo con iniciales ====== */
    .avatar {
      width: 52px; height: 52px; border-radius: 50%;
      flex-shrink: 0;
      background: #F5B800;
      color: #111111;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: 800; letter-spacing: .02em;
      box-shadow: 0 3px 8px rgba(245,184,0,.35);
      border: 2px solid #111111;
    }
    .avatar.lg {
      width: 84px; height: 84px; margin: 0 auto 12px;
      font-size: 28px;
    }

    .card-name { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
    .name { font-size: 16px; font-weight: 800; color: #111; letter-spacing: -.01em; }
    .rating { font-size: 13px; font-weight: 600; color: #4A4A4A; }
    .rating.big { font-size: 14px; }
    .star { color: #F5B800; }
    .sep { margin: 0 5px; color: #D8D8D2; }
    .exp { font-size: 12.5px; color: #8A8A85; font-weight: 500; }
    .exp.center { text-align: center; margin-top: 3px; }

    .offer { display: flex; gap: 10px; margin-bottom: 14px; }
    .offer-block {
      flex: 1; border: 1.5px solid #F0F0EC; border-radius: 12px;
      padding: 10px 12px; display: flex; flex-direction: column; gap: 3px;
      background: #FCFCFA;
    }
    .o-val { font-size: 16px; font-weight: 800; color: #111; }
    .o-lbl { font-size: 10px; font-weight: 600; color: #9A9A92; text-transform: uppercase; letter-spacing: .06em; }

    .btn-outline {
      width: 100%; padding: 12px; border: 2px solid #111111; background: #fff;
      border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; color: #111;
      transition: background .15s, color .15s;
    }
    .btn-outline:hover { background: #111; color: #F5B800; }
    .btn-outline:active { transform: translateY(1px); }

    .btn-solid {
      width: 100%; padding: 15px; border: none;
      background: #F5B800; color: #111111; border-radius: 12px;
      font-size: 15px; font-weight: 800; cursor: pointer; margin-top: 8px;
      letter-spacing: .01em;
      box-shadow: 0 6px 16px rgba(245,184,0,.40);
      transition: transform .12s, box-shadow .2s, background .15s;
    }
    .btn-solid:hover { background: #FFC21F; box-shadow: 0 8px 22px rgba(245,184,0,.5); }
    .btn-solid:active { transform: translateY(1px); }

    .btn-text {
      width: 100%; padding: 13px; border: none; background: none;
      color: #8A8A85; font-size: 13px; font-weight: 600; cursor: pointer; margin-top: 4px;
    }
    .btn-text:hover { color: #111; }

    .profile-head { text-align: center; margin-bottom: 20px; }
    .profile-name { font-size: 20px; font-weight: 800; color: #111; letter-spacing: -.01em; }
    .profile-offer { margin: 6px 0 20px; }

    .block { margin-bottom: 20px; }
    .block-lbl {
      font-size: 11px; text-transform: uppercase; letter-spacing: .1em;
      color: #B8860B; font-weight: 700; margin-bottom: 10px;
    }

    .gallery { display: flex; gap: 9px; }
    .gphoto { flex: 1; }
    /* ====== GALERÍA: placeholder sólido ====== */
    .gphoto {
      aspect-ratio: 1; border-radius: 12px;
      background: #F5B800;
      border: 2px solid #111111;
      display: flex; align-items: center; justify-content: center;
      text-align: center; padding: 4px;
    }
    .gphoto-lbl {
      font-size: 9.5px; font-weight: 700; color: #111111;
      text-transform: uppercase; letter-spacing: .03em; line-height: 1.2;
    }

    .social-list { display: flex; flex-direction: column; gap: 9px; }
    .social { display: flex; align-items: center; gap: 10px; font-size: 13.5px; font-weight: 500; color: #333; }
    .social-dot {
      width: 9px; height: 9px; border-radius: 50%;
      background: #F5B800; flex-shrink: 0; border: 1.5px solid #111;
    }

    .doc { display: flex; align-items: center; gap: 10px; font-size: 13.5px; font-weight: 500; color: #333; padding: 5px 0; }
    .doc-icon { color: #F5B800; font-size: 15px; }

    .reviews { margin-bottom: 22px; }
    .reviews-label { font-size: 13px; font-weight: 800; color: #111; margin-bottom: 12px; }
    .review { border-top: 1.5px solid #F0F0EC; padding: 12px 0; }
    .review .star { font-size: 11px; letter-spacing: 1px; color: #F5B800; }
    .review p { margin: 5px 0 0; font-size: 13px; font-weight: 500; color: #444; line-height: 1.45; }

    .confirm-card {
      border: 1.5px solid #EFEFEC; border-radius: 16px; background: #fff;
      padding: 4px 16px; margin-bottom: 18px;
      box-shadow: 0 2px 10px rgba(17,17,17,.04);
    }
    .confirm-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 16px 0; }
    .c-lbl { font-size: 13px; font-weight: 600; color: #8A8A85; }
    .c-val { font-size: 14px; font-weight: 800; color: #111; text-align: right; }
    .divider { height: 1.5px; background: #F3F3F0; }

    .notice {
      background: #FFF8E1; border: 1.5px solid #F5B800; border-radius: 12px;
      padding: 14px; font-size: 13px; font-weight: 600; color: #6B5200; line-height: 1.45;
      margin-bottom: 20px; text-align: center;
    }

    .end { text-align: center; padding-top: 90px; }
    .check {
      width: 72px; height: 72px; border-radius: 50%;
      background: #F5B800; color: #111111; font-size: 34px; font-weight: 800;
      display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
      box-shadow: 0 8px 24px rgba(245,184,0,.45);
      border: 3px solid #111;
    }
    .end-title { font-size: 20px; font-weight: 800; color: #111; }
    .end-sub { font-size: 13px; font-weight: 500; color: #8A8A85; margin: 8px 0 28px; }
  `]
})
export class AppComponent {
  pantalla = signal(1);
  seleccionado = signal<Tecnico | null>(null);

  iniciales(nombre: string): string {
    return nombre
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(p => p.charAt(0).toUpperCase())
      .join('');
  }

  imagenes(nombre: string): string {
    switch (nombre) {
      case 'Carlos Ramírez':
        return 'assets/images/rostro1.jpg';

      case 'Luis Fernández':
        return 'assets/images/rostro2.jpg';

      case 'Miguel Quispe':
        return 'assets/images/rostro3.jpg';

      default:
        return 'assets/images/rostro3.jpg';
    }
  }

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
