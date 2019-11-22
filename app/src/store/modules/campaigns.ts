import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule,
} from 'vuex-module-decorators';
import store from '@/store';

import { ICampaignEntity } from '@/declarations';
import { getCampaigns } from '@/api/campaigns';

@Module({ dynamic: true, store, name: 'campaigns' })
class Campaigns extends VuexModule {
  private all: ICampaignEntity[] = [];

  public get campaigns() {
    return this.all || [];
  }

  @Mutation
  private SET_CAMPAIGNS(data: ICampaignEntity[]) {
    this.all = data;
  }

  @Mutation
  private ADD_CAMPAIGN(data: ICampaignEntity) {
    const found = this.all.findIndex(c => c.id === data.id);
    found !== -1 ? this.all.splice(found, 1, data) : this.all.push(data);
  }

  @Action
  public getCampaign(id: number): ICampaignEntity | undefined {
    const found = this.all.findIndex(c => c.id === id);
    if (found !== -1) return this.all[found];
    return undefined;
  }

  @Action
  public setup(): Promise<void> {
    return new Promise((resolve, reject) => {
      getCampaigns()
        .then((res: any) => {
          this.SET_CAMPAIGNS(res || []);
          resolve();
        })
        .catch((e: any) => reject(e));
    });
  }

  @Action
  public addCampaign(campaign: ICampaignEntity) {
    this.ADD_CAMPAIGN(campaign);
  }
}

export const CampaignsModule = getModule(Campaigns);
