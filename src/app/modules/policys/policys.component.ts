import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PolicyService } from '../../@core/services/policy/policy.service';
import { PolicyType } from '../../@core/enums/policy.enum';
import { take } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-policys',
  templateUrl: './policys.component.html',
  styleUrls: ['./policys.component.css'],
})
export class PolicysComponent implements OnInit {
  content!: SafeHtml;

  constructor(
    private route: ActivatedRoute,
    private policyService: PolicyService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const typeParam = params.get('type') ?? '';

      let type: PolicyType | null = null;

      if (typeParam.includes('termos-de-uso')) {
        type = PolicyType.TERMS;
      } else if (typeParam.includes('politica-de-privacidade')) {
        type = PolicyType.PRIVACY;
      }

      if (!type) {
        console.error('Rota inválida:', typeParam);
        return;
      }

      this.loadContent(type);
    });
  }

  loadContent(type: PolicyType) {
    this.policyService
      .getContent(type)
      .pipe(take(1))
      .subscribe({
        next: (data: any) => {
          const rawHtml = data?.content || '';
          this.content = this.sanitizer.bypassSecurityTrustHtml(rawHtml);
        },
        error: () => {
          console.error('Erro ao carregar o conteúdo da política.');
        },
      });
  }
}
