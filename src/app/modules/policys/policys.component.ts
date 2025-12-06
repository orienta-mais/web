import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PolicyService } from '../../@core/services/policy/policy.service';
import { PolicyType } from '../../@core/enums/policy.enum';

@Component({
  selector: 'app-policys',
  templateUrl: './policys.component.html',
  styleUrls: ['./policys.component.css'],
})
export class PolicysComponent implements OnInit {
  content: string = '';

  constructor(
    private route: ActivatedRoute,
    private policyService: PolicyService,
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
    this.policyService.getContent(type).subscribe((html) => {
      this.content = html;
    });
  }
}
