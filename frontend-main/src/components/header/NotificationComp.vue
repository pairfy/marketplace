<template>
    <div class="notification">


        <div class="card-image" @click="toggle">
            <OverlayBadge value="1" severity="danger" id="notifications">
                <i class="pi pi-bell" />
            </OverlayBadge>
        </div>


        <Popover ref="overlay">
            <section>
                <div class="nav">
                    <div class="nav-item" :class="{ selected: currentNav === 0 }" @click="currentNav = 0">
                        New
                    </div>
                    <div class="nav-item" :class="{ selected: currentNav === 1 }" @click="currentNav = 1">
                        All
                    </div>
                </div>

                <div class="drop" v-if="currentNav === 0">
                    <div class="empty-legend" v-if="!unseen.length"> <span>No notifications</span></div>
                    <div class="drop-item" v-for="item in unseen" :key="item">
                        <OverlayBadge value="" severity="danger">
                            <div class="drop-image" @click="onHandleClick(item)">
                                <i class="pi pi-bell" />
                            </div>
                        </OverlayBadge>
                        <div class="drop-box">
                            <div class="drop-title" @click="onHandleClick(item)">
                                {{ item.title }}

                                <span>{{ getTimeAgo(item.created_at) }}</span>
                            </div>
                            <div class="drop-message" @click="onHandleClick(item)">
                                {{ item.message }}
                            </div>

                            <div class="drop-pad" @click="handleSeen(item.id)">
                                <span>Mark as read</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="drop" v-if="currentNav === 1">
                    <div class="empty-legend" v-if="!seen.length"> <span>No notifications</span></div>
                    <div class="drop-item" v-for="item in seen" :key="item">

                        <OverlayBadge value="" severity="secondary">
                            <div class="drop-image" @click="onHandleClick(item)">
                                <i class="pi pi-shopping-cart" />
                            </div>
                        </OverlayBadge>
                        <div class="drop-box">
                            <div class="drop-title" @click="onHandleClick(item)">
                                {{ item.title }}

                                <span>{{ getTimeAgo(item.created_at) }}</span>
                            </div>
                            <div class="drop-message" @click="onHandleClick(item)">
                                {{ item.message }}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Popover>
    </div>
</template>

<script setup>
import gql from 'graphql-tag';
import { ref, watch, reactive, computed, inject } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { useRouter } from 'vue-router';
import { format } from 'timeago.js';

const { setupAudio } = inject('utils');

const router = useRouter();

const overlay = ref(true);

const toggle = (event) => {
    overlay.value.toggle(event);
}

const currentNav = ref(0);

const { playNotification } = setupAudio();

//////////////////////////////////////////////////////////////////////////////

const queryOptions = {
    pollInterval: 30000,
    clientId: 'notification'
}

const unseenSet = reactive({
    value: new Set()
});

const seenSet = reactive({
    value: new Set()
});

const unseen = computed(() => Array.from(unseenSet.value));

const seen = computed(() => Array.from(seenSet.value));

const { result: onGetNotification, onError: onGetNotificationsError } = useQuery(gql`
      query getNotifications {
        getNotifications {
            id
            type
            title
            owner
            seen
            data
            message
            created_at
        }
      }
`,
    null,
    queryOptions
);

watch(onGetNotification, value => {
    const items = value.getNotifications;

    items.forEach((element, index) => {
        if (!element.seen) {
            if (!unseenSet.value.has(element)) {
                unseenSet.value.add(element)
                if (index === items.length - 1) {
                    playNotification()
                    showBox()
                }
            }
        } else {
            if (!seenSet.value.has(element)) {
                seenSet.value.add(element)
            }
        }

    })
});

onGetNotificationsError(error => {
    console.log(error)
})

//////////////////////////////////////////////////////////////////////////////

const { mutate: updateNotification } = useMutation(gql`
      mutation updateNotification ($updateNotificationVariable: UpdateNotificationInput!) {
        updateNotification (updateNotificationInput: $updateNotificationVariable) {
          success
        }
      }
    `, {
    clientId: 'notification'
})

const handleSeen = (id) => {
    updateNotification({
        "updateNotificationVariable": {
            notification_id: id
        }
    })

    showBox()
}

//////////////////////////////////////////////////////////////////////////////

const showBox = () => {
    const div = document.getElementById('notifications');

    if (div) {
        div.click();
    }
}

const getTimeAgo = (createdAt) => format(createdAt, 'en_US')


const onHandleClick = (notification) => {
    if (!notification) {
        return;
    }

    const { type, data } = notification;

    const datum = JSON.parse(data);

    if (type === 'order') {
        console.log(notification);

        router.push({
            name: 'order',
            params: {
                id: datum.threadtoken
            }
        })
            .then(() => window.location.reload())
            .catch((err) => {
                if (err.name !== 'NavigationDuplicated') {
                    console.error(err);
                }
            });
    }
}

</script>

<style lang="css" scoped>
.notification {
    margin: 0 auto;
    display: flex;
    align-items: center;
}

.card-image {
    cursor: pointer;
}

.card-image i {
    font-size: var(--text-size-3);
}

.drop {
    width: 350px;
    word-break: break-all;
}

.drop-item {
    border-bottom: 1px solid var(--border-a);
    display: flex;
    padding: 1rem 0;
    transition: 0.2s;
}

.drop-image {
    width: 40px;
    height: 40px;
    background: var(--background-b);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    cursor: pointer;
}

.drop-image i {
    font-size: 25px;
}

.drop-box {
    display: block;
    margin-left: 1rem;
}

.drop-title {
    font-weight: 700;
    text-align: start;
    font-size: var(--text-size-1);
    cursor: pointer;
}

.drop-title span {
    font-weight: 400;
    margin-left: 0.5rem;
}

.drop-message {
    text-align: left;
    margin-top: 0.25rem;
    font-size: var(--text-size-1);
    cursor: pointer;
    word-break: break-word;
}

.drop-pad {
    margin-top: 0.5rem;
    cursor: default;
}

.drop-pad span {
    background: var(--background-b);
    font-size: var(--text-size-1);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
}

.nav {
    display: flex;
}

.nav-item {
    padding: 0.5rem 1rem;
    font-size: var(--text-size-1);
    border-bottom: 2px solid var(--border-a);
    cursor: pointer;
}

.nav-item.selected {
    border-bottom: 2px solid var(--primary-c);
}

.empty-legend {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    color: var(--text-b);
}
</style>