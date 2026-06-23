import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Tecnico {
  id: number;
  nombre: string;
  inicial: string;
  calificacion: number;
  trabajos: number;
  respuesta: string;
  aceptacion: number;
  likes: number;
  dislikes: number;
  precio: number;
  horario: string;
  verificado: boolean;
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
            <div class="avatar">{{ t.inicial }}</div>
            <div class="card-name">
              <div class="name-row">
                <span class="name">{{ t.nombre }}</span>
                <span class="verif" *ngIf="t.verificado">✓ Verificado</span>
              </div>
              <div class="rating">
                <span class="star">★</span> {{ t.calificacion }}
                <span class="sep">·</span> {{ t.trabajos }} trabajos
              </div>
            </div>
          </div>

          <div class="metrics">
            <div class="metric">
              <span class="m-val">{{ t.respuesta }}</span>
              <span class="m-lbl">Resp. promedio</span>
            </div>
            <div class="metric">
              <span class="m-val">{{ t.aceptacion }}%</span>
              <span class="m-lbl">Aceptación</span>
            </div>
            <div class="metric">
              <span class="m-val">▲ {{ t.likes }} &nbsp; ▼ {{ t.dislikes }}</span>
              <span class="m-lbl">Likes / Dislikes</span>
            </div>
          </div>

          <div class="offer">
            <div class="offer-block">
              <span class="o-val">S/{{ t.precio }}</span>
              <span class="o-lbl">Precio propuesto</span>
            </div>
            <div class="offer-block">
              <span class="o-val">{{ t.horario }}</span>
              <span class="o-lbl">Horario propuesto</span>
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
          <div class="avatar lg">{{ t.inicial }}</div>
          <div class="profile-name">{{ t.nombre }}</div>
          <div class="verif-line" *ngIf="t.verificado">✓ Identidad verificada por RENIEC</div>
          <div class="rating big"><span class="star">★</span> {{ t.calificacion }} · {{ t.trabajos }} trabajos completados</div>
        </div>

        <div class="metrics profile-metrics">
          <div class="metric">
            <span class="m-val">{{ t.respuesta }}</span>
            <span class="m-lbl">Resp. promedio</span>
          </div>
          <div class="metric">
            <span class="m-val">{{ t.aceptacion }}%</span>
            <span class="m-lbl">Ratio de aceptación</span>
          </div>
          <div class="metric">
            <span class="m-val">▲ {{ t.likes }} &nbsp; ▼ {{ t.dislikes }}</span>
            <span class="m-lbl">Likes / Dislikes</span>
          </div>
        </div>

        <div class="offer profile-offer">
          <div class="offer-block">
            <span class="o-val">S/{{ t.precio }}</span>
            <span class="o-lbl">Precio propuesto</span>
          </div>
          <div class="offer-block">
            <span class="o-val">{{ t.horario }}</span>
            <span class="o-lbl">Horario propuesto</span>
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
            <span class="c-lbl">Horario aceptado</span>
            <span class="c-val">{{ t.horario }}</span>
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
      display: flex;
      justify-content: center;
      background: #e9e9e9;
      min-height: 100vh;
      font-family: -apple-system, 'Segoe UI', Roboto, sans-serif;
      color: #1f1f1f;
    }
    .frame {
      width: 100%;
      max-width: 390px;
      background: #fafafa;
      min-height: 100vh;
      box-shadow: 0 0 0 1px #d8d8d8;
    }
    .screen { padding: 16px 16px 40px; }

    .topbar {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding-bottom: 14px;
      margin-bottom: 14px;
      border-bottom: 1px solid #dcdcdc;
      position: relative;
    }
    .step { font-size: 11px; color: #8a8a8a; letter-spacing: .04em; text-transform: uppercase; }
    .title { font-size: 17px; font-weight: 600; }
    .back {
      background: none; border: none; padding: 0 0 4px;
      font-size: 13px; color: #555; cursor: pointer; text-align: left;
    }

    .job {
      background: #f0f0f0;
      border: 1px solid #d8d8d8;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 18px;
    }
    .job-label { font-size: 10px; text-transform: uppercase; letter-spacing: .05em; color: #8a8a8a; margin-bottom: 4px; }
    .job-title { font-size: 14px; font-weight: 600; line-height: 1.35; margin-bottom: 8px; }
    .job-meta { display: flex; justify-content: space-between; font-size: 12px; color: #5a5a5a; }

    .list-label { font-size: 12px; color: #7a7a7a; margin-bottom: 10px; }

    .card {
      border: 1px solid #d8d8d8;
      border-radius: 10px;
      background: #fff;
      padding: 14px;
      margin-bottom: 14px;
    }
    .card-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
    .avatar {
      width: 42px; height: 42px; border-radius: 50%;
      background: #d0d0d0; color: #4a4a4a;
      display: flex; align-items: center; justify-content: center;
      font-weight: 600; font-size: 16px; flex-shrink: 0;
    }
    .avatar.lg { width: 64px; height: 64px; font-size: 24px; margin: 0 auto 10px; }
    .card-name { flex: 1; min-width: 0; }
    .name-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .name { font-size: 15px; font-weight: 600; }
    .verif { font-size: 10px; color: #4a4a4a; border: 1px solid #bcbcbc; border-radius: 4px; padding: 1px 5px; }
    .rating { font-size: 13px; color: #555; margin-top: 2px; }
    .rating.big { font-size: 14px; }
    .star { color: #6b6b6b; }
    .sep { margin: 0 4px; color: #bbb; }

    .metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
      background: #f4f4f4;
      border-radius: 8px;
      padding: 10px 6px;
      margin-bottom: 12px;
    }
    .metric { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 2px; }
    .m-val { font-size: 13px; font-weight: 600; }
    .m-lbl { font-size: 9.5px; color: #8a8a8a; line-height: 1.2; }

    .offer { display: flex; gap: 10px; margin-bottom: 12px; }
    .offer-block {
      flex: 1; border: 1px solid #e0e0e0; border-radius: 8px;
      padding: 8px 10px; display: flex; flex-direction: column; gap: 2px;
    }
    .o-val { font-size: 15px; font-weight: 700; }
    .o-lbl { font-size: 10px; color: #8a8a8a; }

    .btn-outline {
      width: 100%; padding: 10px; border: 1px solid #9a9a9a;
      background: #fff; border-radius: 8px; font-size: 14px; font-weight: 500;
      cursor: pointer; color: #1f1f1f;
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

    .profile-head { text-align: center; margin-bottom: 16px; }
    .profile-name { font-size: 18px; font-weight: 600; }
    .verif-line { font-size: 12px; color: #4a4a4a; margin: 4px 0; }
    .profile-metrics { margin-bottom: 14px; }
    .profile-offer { margin-bottom: 18px; }

    .reviews { margin-bottom: 20px; }
    .reviews-label { font-size: 13px; font-weight: 600; margin-bottom: 10px; }
    .review {
      border-top: 1px solid #e4e4e4; padding: 10px 0;
    }
    .review .star { font-size: 11px; letter-spacing: 1px; }
    .review p { margin: 4px 0 0; font-size: 13px; color: #444; line-height: 1.4; }

    .confirm-card {
      border: 1px solid #d8d8d8; border-radius: 10px; background: #fff;
      padding: 4px 14px; margin-bottom: 16px;
    }
    .confirm-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; }
    .c-lbl { font-size: 13px; color: #7a7a7a; }
    .c-val { font-size: 14px; font-weight: 600; }
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
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 18px;
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
      id: 1, nombre: 'Carlos Ramírez', inicial: 'CR',
      calificacion: 4.8, trabajos: 47, respuesta: '15 min', aceptacion: 92,
      likes: 132, dislikes: 4, precio: 130, horario: 'Sábado 9:00 a.m.',
      verificado: true,
      resenas: [
        'Instaló la puerta en 2 horas y dejó todo limpio.',
        'Trabajo muy profesional y puntual.',
        'Buena comunicación durante todo el servicio.'
      ]
    },
    {
      id: 2, nombre: 'Luis Fernández', inicial: 'LF',
      calificacion: 4.9, trabajos: 89, respuesta: '45 min', aceptacion: 98,
      likes: 210, dislikes: 3, precio: 145, horario: 'Sábado 10:00 a.m.',
      verificado: true,
      resenas: [
        'Instaló la puerta en 2 horas y dejó todo limpio.',
        'Trabajo muy profesional y puntual.',
        'Buena comunicación durante todo el servicio.'
      ]
    },
    {
      id: 3, nombre: 'Miguel Quispe', inicial: 'MQ',
      calificacion: 4.5, trabajos: 23, respuesta: '5 min', aceptacion: 75,
      likes: 40, dislikes: 12, precio: 110, horario: 'Sábado 11:00 a.m.',
      verificado: true,
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

